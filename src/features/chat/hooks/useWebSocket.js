import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import cryptoService from '@/utils/cryptoService';
import keyManagementService from '@/services/keyManagementService';

export const useWebSocket = (userId, onIncomingMessage, onNotification) => {
  const ws = useRef(null);
  const stableUserId = useRef(userId);
  
  const connect = useCallback(() => {
    if (ws.current?.connected) return;
    if (ws.current) {
      ws.current.removeAllListeners();
      ws.current.disconnect();
    }
    
    if (!stableUserId.current) {
      console.warn("No user ID provided for socket connection");
      return;
    }
    
    console.log(`Attempting to connect socket for user ID: ${stableUserId.current}`);
    
    const userIdStr = String(stableUserId.current);
    
    ws.current = io("/", {
      path: "/chat/socket.io",
      transports: ["websocket"],
      query: { userId: userIdStr },
      withCredentials: true,
      extraHeaders: { Cookie: document.cookie },
      autoConnect: true,
      reconnection: true,
    });

    ws.current.on("connect", () => {
      console.log("WebSocket connected with ID:", ws.current.id);
      ws.current.emit("authenticate", { userId: userIdStr });
    });

    // Handle incoming group messages
    ws.current.on("grpMessage", async (msg) => {
      console.log("Received encrypted group message:", msg);
      
      try {
        // Check if this is an optimized group message (new format)
        if (msg.encrypted && msg.messageContent && msg.keyDistribution) {
          // First get my key distribution data
          const myKeyData = msg.keyDistribution[userIdStr];
          
          if (myKeyData) {
            // Decrypt the group key using my private key and sender's public key
            const groupKey = await cryptoService.decryptGroupKey(
              myKeyData.cipherText,
              myKeyData.nonce,
              msg.senderId,
              msg.senderPublicKey
            );
            
            // Now decrypt the actual message using the group key
            const decryptedContent = cryptoService.decryptMessage(
              msg.messageContent.cipherText,
              msg.messageContent.nonce,
              groupKey
            );
            
            // Replace the encrypted content with decrypted content
            msg.content = decryptedContent;
            msg.encrypted = false;
            
            // Clean up encryption data before passing to handler
            delete msg.messageContent;
            delete msg.keyDistribution;
            
            if (onIncomingMessage) onIncomingMessage(msg);
          } else {
            console.warn("Message encrypted, but no key data for this user");
            if (onIncomingMessage) onIncomingMessage(msg); // Still deliver the message
          }
        }
        // Check if this is a legacy per-user encrypted message
        else if (msg.encrypted && msg.recipientEncryptions) {
          // Legacy format - individual message encryption per user
          const myEncryption = msg.recipientEncryptions[userIdStr];
          
          if (myEncryption) {
            const decryptedContent = await cryptoService.decryptFromSender(
              myEncryption.cipherText,
              myEncryption.nonce,
              msg.senderId,
              msg.senderPublicKey
            );
            
            msg.content = decryptedContent;
            msg.encrypted = false;
            delete msg.recipientEncryptions;
            
            if (onIncomingMessage) onIncomingMessage(msg);
          } else {
            console.warn("Legacy encryption format: no data for this user");
            if (onIncomingMessage) onIncomingMessage(msg);
          }
        }
        // Simple encryption format with direct content
        else if (msg.encrypted && msg.nonce) {
          const decryptedContent = await cryptoService.decryptFromSender(
            msg.content,
            msg.nonce,
            msg.senderId,
            msg.senderPublicKey
          );
          
          msg.content = decryptedContent;
          msg.encrypted = false;
          
          if (onIncomingMessage) onIncomingMessage(msg);
        }
        // Unencrypted messages - pass through
        else {
          if (onIncomingMessage) onIncomingMessage(msg);
        }
      } catch (error) {
        console.error("Error processing group message:", error);
        // Still deliver the message for logging
        if (onIncomingMessage) onIncomingMessage(msg);
      }
    });

    // Handle incoming direct messages
    ws.current.on("message", async (msg) => {
      console.log("Received encrypted direct message:", msg);
      
      try {
        // If the message is encrypted, decrypt it
        if (msg.encrypted && msg.nonce) {
          const decryptedContent = await cryptoService.decryptFromSender(
            msg.content,
            msg.nonce,
            msg.senderId,
            msg.senderPublicKey
          );
          
          msg.content = decryptedContent;
          msg.encrypted = false;
          
          if (onIncomingMessage) onIncomingMessage(msg);
        } else {
          if (onIncomingMessage) onIncomingMessage(msg);
        }
      } catch (error) {
        console.error("Error decrypting message:", error);
        // Still deliver the message for logging
        if (onIncomingMessage) onIncomingMessage(msg);
      }
    });

    ws.current.on("notification", (notificationData) => {
      console.log("Received notification:", notificationData);
      if (onNotification) onNotification(notificationData);
    });

    ws.current.on("disconnect", (reason) => {
      console.warn("WebSocket disconnected:", reason);
    });

    ws.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });
    
    ws.current.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }, [onIncomingMessage, onNotification]);

  useEffect(() => {
    stableUserId.current = userId;
    connect();
    
    return () => {
      if (ws.current) {
        console.log("Disconnecting WebSocket");
        ws.current.disconnect();
        ws.current = null;
      }
    };
  }, [userId, connect]);

  // Encrypt and send a direct message
  const sendDirectMessage = async (payload) => {
    if (!ws.current?.connected) {
      console.warn("WebSocket not connected; message not sent");
      connect();
      return;
    }

    try {
      // Create a copy of the payload to encrypt
      const encryptedPayload = { ...payload };
      
      // Get recipient's public key
      const recipientPublicKey = await keyManagementService.getPublicKey(payload.receiverId);
      
      if (recipientPublicKey) {
        // Encrypt the message content
        const { cipherText, nonce } = await cryptoService.encryptForRecipient(
          payload.content,
          payload.receiverId,
          recipientPublicKey
        );
        
        // Update payload with encrypted content
        encryptedPayload.content = cipherText;
        encryptedPayload.nonce = nonce;
        encryptedPayload.encrypted = true;
        
        // Add sender's public key so recipient can decrypt
        encryptedPayload.senderPublicKey = await keyManagementService.getPublicKey(
          stableUserId.current
        );
        
        console.log("Sending encrypted direct message:", encryptedPayload);
        ws.current.emit("message", encryptedPayload);
      } else {
        console.warn("Recipient public key not found, sending unencrypted");
        console.log("Sending unencrypted message:", payload);
        ws.current.emit("message", payload);
      }
    } catch (error) {
      console.error("Error sending direct message:", error);
      // Still try to send the message unencrypted as fallback
      console.log("Sending fallback unencrypted message:", payload);
      ws.current.emit("message", payload);
    }
  };

  // Encrypt and send a group message - optimized version
  const sendGroupMessage = async (payload) => {
    if (!ws.current?.connected) {
      console.warn("WebSocket not connected; message not sent");
      connect();
      return;
    }

    try {
      // Get all channel members with their public keys
      const members = await keyManagementService.getGroupMembersPublicKeys(payload.channelId);
      
      if (members.length > 0) {
        // Create a copy of the payload for encryption
        const encryptedPayload = { ...payload };
        
        // Use optimized group encryption (encrypt once, distribute key)
        const encryptionResult = await cryptoService.encryptForGroup(
          payload.content,
          payload.channelId, // Pass channelId for group key management
          members
        );
        
        // Update payload with encrypted content
        encryptedPayload.messageContent = encryptionResult.messageContent;
        encryptedPayload.keyDistribution = encryptionResult.keyDistribution;
        encryptedPayload.messageId = encryptionResult.originalMessageId;
        encryptedPayload.encrypted = true;
        
        // Original content is replaced with a placeholder
        encryptedPayload.content = "[Encrypted message]";
        
        // Add sender's public key for recipients to decrypt
        encryptedPayload.senderPublicKey = await keyManagementService.getPublicKey(
          stableUserId.current
        );
        
        console.log("Sending optimized encrypted group message:", encryptedPayload);
        ws.current.emit("grpMessage", encryptedPayload);
      } else {
        console.warn("No member public keys found, sending unencrypted");
        console.log("Sending unencrypted group message:", payload);
        ws.current.emit("grpMessage", payload);
      }
    } catch (error) {
      console.error("Error sending group message:", error);
      // Still try to send the message unencrypted as fallback
      console.log("Sending fallback unencrypted message:", payload);
      ws.current.emit("grpMessage", payload);
    }
  };

  // Main send message function that routes to the appropriate handler
  const sendMessage = useCallback(async (payload) => {
    if (payload.type === "direct_message") {
      await sendDirectMessage(payload);
    } else {
      await sendGroupMessage(payload);
    }
  }, []);

  return { sendMessage };
};

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
        // Check if this message is individually encrypted for this user
        if (msg.encrypted && msg.recipientEncryptions) {
          // This is a secure group message with individual encryption
          const myEncryption = msg.recipientEncryptions[userIdStr];
          
          if (myEncryption) {
            // This message has encryption data specifically for this user
            const decryptedContent = await cryptoService.decryptFromSender(
              myEncryption.cipherText,
              myEncryption.nonce,
              msg.senderId,
              msg.senderPublicKey
            );
            
            // Replace the encrypted content with decrypted content
            msg.content = decryptedContent;
            msg.encrypted = false;
            delete msg.recipientEncryptions; // Remove encryption data from the message object
            
            if (onIncomingMessage) onIncomingMessage(msg);
          } else {
            console.warn("Message encrypted, but no encryption data for this user");
            if (onIncomingMessage) onIncomingMessage(msg); // Still deliver the message
          }
        } 
        // Legacy encrypted messages - decrypt directly
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

  // Encrypt and send a group message
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
        // Create a copy of the payload for E2E encryption
        const encryptedPayload = { ...payload };
        
        // Encrypt the message for each recipient individually
        const encryptionResult = await cryptoService.encryptForGroup(
          payload.content,
          members
        );
        
        // Message ID to trace message across different encryptions
        encryptedPayload.messageId = encryptionResult.originalMessageId;
        
        // Store individual encryptions for each recipient
        encryptedPayload.recipientEncryptions = encryptionResult.individualEncryptions;
        encryptedPayload.encrypted = true;
        
        // Original content is replaced with a placeholder
        encryptedPayload.content = "[Encrypted message]";
        
        // Add sender's public key for recipients to decrypt
        encryptedPayload.senderPublicKey = await keyManagementService.getPublicKey(
          stableUserId.current
        );
        
        console.log("Sending encrypted group message:", encryptedPayload);
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

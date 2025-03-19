import * as kyber from 'crystals-kyber-js';
import sodium from 'libsodium-wrappers';
import { openDatabase, storePrivateKey, getPrivateKey } from './indexedDBUtils';

// Initialize Libsodium
await sodium.ready;

// Class for managing message encryption/decryption operations
class CryptoService {
  constructor() {
    this.encryptionCache = new Map(); // Cache for shared secrets
  }

  // Generate Kyber-768 Key Pair
  async generateKeyPair() {
    try {
      const keyPair = kyber.KeyGen(kyber.KYBER_768);
      const publicKey = Buffer.from(keyPair.publicKey).toString('base64');
      const privateKey = Buffer.from(keyPair.privateKey).toString('base64');
      
      return { publicKey, privateKey };
    } catch (error) {
      console.error('Error generating key pair:', error);
      throw error;
    }
  }

  // Generate and store keys, return public key
  async generateAndStoreKeyPair() {
    try {
      const { publicKey, privateKey } = await this.generateKeyPair();
      
      // Store private key in IndexedDB
      await storePrivateKey(privateKey);
      
      return publicKey;
    } catch (error) {
      console.error('Error generating and storing keys:', error);
      throw error;
    }
  }

  // Generate a shared secret between sender and recipient
  generateSharedSecret(publicKey, privateKey) {
    try {
      const { sharedSecret } = kyber.Decrypt(
        Buffer.from(publicKey, 'base64'),
        Buffer.from(privateKey, 'base64'),
        kyber.KYBER_768
      );
      
      return Buffer.from(sharedSecret).toString('base64');
    } catch (error) {
      console.error('Error generating shared secret:', error);
      throw error;
    }
  }

  // Get or create a shared secret for a recipient
  async getSharedSecret(recipientId, recipientPublicKey) {
    // Check cache first
    const cacheKey = `${recipientId}`;
    if (this.encryptionCache.has(cacheKey)) {
      return this.encryptionCache.get(cacheKey);
    }

    try {
      // Get our private key from IndexedDB
      const privateKey = await getPrivateKey();
      if (!privateKey) {
        console.error("No private key found in IndexedDB");
        return null;
      }

      // Generate shared secret
      const sharedSecret = this.generateSharedSecret(recipientPublicKey, privateKey);
      
      // Cache the shared secret
      this.encryptionCache.set(cacheKey, sharedSecret);
      
      return sharedSecret;
    } catch (error) {
      console.error('Error getting shared secret:', error);
      return null;
    }
  }

  // Encrypt a message using the shared secret
  encryptMessage(message, sharedSecret) {
    try {
      const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
      const cipherText = sodium.crypto_secretbox_easy(
        sodium.from_string(message),
        nonce,
        sodium.from_base64(sharedSecret)
      );

      return {
        cipherText: sodium.to_base64(cipherText),
        nonce: sodium.to_base64(nonce)
      };
    } catch (error) {
      console.error('Error encrypting message:', error);
      throw error;
    }
  }

  // Decrypt a message using the shared secret
  decryptMessage(cipherText, nonce, sharedSecret) {
    try {
      const decryptedMessage = sodium.crypto_secretbox_open_easy(
        sodium.from_base64(cipherText),
        sodium.from_base64(nonce),
        sodium.from_base64(sharedSecret)
      );

      return sodium.to_string(decryptedMessage);
    } catch (error) {
      console.error('Error decrypting message:', error);
      throw error;
    }
  }

  // Encrypt a message for a specific recipient
  async encryptForRecipient(message, recipientId, recipientPublicKey) {
    try {
      const sharedSecret = await this.getSharedSecret(recipientId, recipientPublicKey);
      if (!sharedSecret) {
        throw new Error('Could not generate shared secret');
      }
      
      return this.encryptMessage(message, sharedSecret);
    } catch (error) {
      console.error('Error encrypting message for recipient:', error);
      throw error;
    }
  }

  // Decrypt a message from a sender
  async decryptFromSender(cipherText, nonce, senderId, senderPublicKey) {
    try {
      const sharedSecret = await this.getSharedSecret(senderId, senderPublicKey);
      if (!sharedSecret) {
        throw new Error('Could not generate shared secret');
      }
      
      return this.decryptMessage(cipherText, nonce, sharedSecret);
    } catch (error) {
      console.error('Error decrypting message from sender:', error);
      throw error;
    }
  }

  // Encrypt a message for multiple recipients (group chat)
  async encryptForGroup(message, recipients) {
    try {
      const result = {
        individualEncryptions: {},
        originalMessageId: Date.now().toString()
      };
      
      // Encrypt the same message individually for each recipient
      for (const recipient of recipients) {
        const { recipientId, publicKey } = recipient;
        if (publicKey) {
          try {
            const encryption = await this.encryptForRecipient(message, recipientId, publicKey);
            result.individualEncryptions[recipientId] = encryption;
          } catch (err) {
            console.error(`Failed to encrypt for recipient ${recipientId}:`, err);
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error encrypting for group:', error);
      throw error;
    }
  }

  // Clear the encryption cache
  clearCache() {
    this.encryptionCache.clear();
  }
}

// Export a singleton instance
const cryptoService = new CryptoService();
export default cryptoService; 
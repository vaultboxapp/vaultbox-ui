import axios from 'axios';

const API_URL = '/api';

class KeyManagementService {
  // Fetch a user's public key
  async getPublicKey(userId) {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}/publicKey`);
      return response.data.publicKey;
    } catch (error) {
      console.error(`Error fetching public key for user ${userId}:`, error);
      return null;
    }
  }

  // Store the current user's public key
  async storePublicKey(userId, publicKey) {
    try {
      const response = await axios.post(`${API_URL}/users/${userId}/publicKey`, {
        publicKey
      });
      return response.data.success;
    } catch (error) {
      console.error('Error storing public key:', error);
      return false;
    }
  }

  // Fetch all group members' public keys
  async getGroupMembersPublicKeys(channelId) {
    try {
      const response = await axios.get(`${API_URL}/channels/${channelId}/members/keys`);
      return response.data.members || [];
    } catch (error) {
      console.error(`Error fetching public keys for channel ${channelId}:`, error);
      return [];
    }
  }

  // Get or create a shared key for a channel
  async getChannelEncryptionKey(channelId) {
    try {
      const response = await axios.get(`${API_URL}/channels/${channelId}/encryptionKey`);
      return response.data.encryptionKey;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Key doesn't exist, create one
        try {
          const createResponse = await axios.post(`${API_URL}/channels/${channelId}/encryptionKey`);
          return createResponse.data.encryptionKey;
        } catch (createError) {
          console.error(`Error creating encryption key for channel ${channelId}:`, createError);
          return null;
        }
      }
      console.error(`Error fetching encryption key for channel ${channelId}:`, error);
      return null;
    }
  }
}

const keyManagementService = new KeyManagementService();
export default keyManagementService; 
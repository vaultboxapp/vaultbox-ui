import { users } from './users';

let messages = {
  channels: [
    {
      id: 1,
      content: "Welcome to the general channel!",
      timestamp: "2023-06-01T09:00:00Z",
      user: users[0],
      senderId: users[0].id,
      channelId: 1,
    },
    {
      id: 2,
      content: "Hi everyone, excited to be here!",
      timestamp: "2023-06-01T09:05:00Z",
      user: users[1],
      senderId: users[1].id,
      channelId: 1,
    },
  ],
  direct: [
    {
      id: 1,
      content: "Hey, how's it going?",
      timestamp: "2023-06-01T10:00:00Z",
      user: users[0],
      senderId: users[0].id,
      receiverId: users[1].id,
    },
    {
      id: 2,
      content: "Not bad, thanks for asking! How about you?",
      timestamp: "2023-06-01T10:05:00Z",
      user: users[1],
      senderId: users[1].id,
      receiverId: users[0].id,
    },
  ],
};

export const getMessages = async (type) => {
  return messages[type];
};

export const sendMessage = async (type, content, recipientId) => {
  const newMessage = {
    id: Date.now(),
    content,
    timestamp: new Date().toISOString(),
    user: users[0], // Assuming the current user is the first user in the list
    senderId: users[0].id,
    receiverId: type === 'direct' ? recipientId : null,
    channelId: type === 'channels' ? recipientId : null,
  };
  messages[type].push(newMessage);
  return newMessage;
};

export const uploadFile = async (type, file, recipientId) => {
  const newMessage = {
    id: Date.now(),
    content: `Uploaded file: ${file.name}`,
    timestamp: new Date().toISOString(),
    user: users[0], // Assuming the current user is the first user in the list
    senderId: users[0].id,
    receiverId: type === 'direct' ? recipientId : null,
    channelId: type === 'channels' ? recipientId : null,
    file: {
      name: file.name,
      url: URL.createObjectURL(file)
    }
  };
  messages[type].push(newMessage);
  return newMessage;
};
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Group from "../models/group.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    const usersWithLastMessage = await Promise.all(
      filteredUsers.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: loggedInUserId, receiverId: user._id },
            { senderId: user._id, receiverId: loggedInUserId },
          ],
        }).sort({ createdAt: -1 });

        const unreadCount = await Message.countDocuments({
          senderId: user._id,
          receiverId: loggedInUserId,
          seenBy: { $ne: loggedInUserId },
        });

        return {
          ...user.toObject(),
          lastMessage,
          unreadCount,
        };
      })
    );

    // Sort by last message date
    usersWithLastMessage.sort((a, b) => {
      const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(0);
      const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(0);
      return dateB - dateA;
    });

    res.status(200).json(usersWithLastMessage);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: chatId } = req.params;
    const { isGroup } = req.query;
    const myId = req.user._id;

    let messages;
    if (isGroup === "true") {
      messages = await Message.find({ groupId: chatId }).populate("senderId", "fullName profilePic").sort({ createdAt: 1 });
    } else {
      messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: chatId },
          { senderId: chatId, receiverId: myId },
        ],
      }).populate("senderId", "fullName profilePic").sort({ createdAt: 1 });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, unlockAt, isGroup } = req.body;
    const { id: chatId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      text,
      image: imageUrl,
      unlockAt,
      ...(isGroup ? { groupId: chatId } : { receiverId: chatId }),
    });

    await newMessage.save();
    await newMessage.populate("senderId", "fullName profilePic");

    if (isGroup) {
      // Broadcast to everyone in the group room
      io.to(chatId).emit("newMessage", newMessage);
      // Update last message in group
      await Group.findByIdAndUpdate(chatId, { lastMessage: newMessage._id });
    } else {
      const receiverSocketId = getReceiverSocketId(chatId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const toggleReaction = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    const existingReactionIndex = message.reactions.findIndex(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingReactionIndex > -1) {
      if (message.reactions[existingReactionIndex].emoji === emoji) {
        // Remove reaction if same emoji
        message.reactions.splice(existingReactionIndex, 1);
      } else {
        // Change emoji
        message.reactions[existingReactionIndex].emoji = emoji;
      }
    } else {
      message.reactions.push({ userId, emoji });
    }

    await message.save();

    // Notify others via socket
    if (message.groupId) {
      io.to(message.groupId.toString()).emit("messageReaction", { messageId, reactions: message.reactions });
    } else {
      io.to(message.senderId.toString()).emit("messageReaction", { messageId, reactions: message.reactions });
      io.to(message.receiverId.toString()).emit("messageReaction", { messageId, reactions: message.reactions });
    }

    res.status(200).json(message.reactions);
  } catch (error) {
    console.log("Error in toggleReaction: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { type } = req.body; // "me" or "everyone"
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    if (type === "me") {
      if (!message.deletedBy.includes(userId)) {
        message.deletedBy.push(userId);
      }
    } else if (type === "everyone") {
      if (message.senderId.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Only sender can delete for everyone" });
      }
      message.isDeletedForEveryone = true;
      message.text = "This message was deleted";
      message.image = null;
    }

    await message.save();

    if (type === "everyone") {
      if (message.groupId) {
        io.to(message.groupId.toString()).emit("messageDeleted", { messageId, isDeletedForEveryone: true });
      } else {
        io.to(message.senderId.toString()).emit("messageDeleted", { messageId, isDeletedForEveryone: true });
        io.to(message.receiverId.toString()).emit("messageDeleted", { messageId, isDeletedForEveryone: true });
      }
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.log("Error in deleteMessage: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markAsSeen = async (req, res) => {
  try {
    const { id: chatId } = req.params;
    const { isGroup } = req.query;
    const userId = req.user._id;

    const query = isGroup === "true"
      ? { groupId: chatId, senderId: { $ne: userId } }
      : { senderId: chatId, receiverId: userId };

    await Message.updateMany(
      { ...query, seenBy: { $ne: userId } },
      { $addToSet: { seenBy: userId } }
    );

    // Notify original sender that their messages are seen
    if (isGroup === "false") {
      io.to(chatId.toString()).emit("messagesSeen", { chatId: userId });
    } else {
      io.to(chatId.toString()).emit("messagesSeen", { chatId: userId, isGroup: true });
    }

    res.status(200).json({ message: "Marked as seen" });
  } catch (error) {
    console.log("Error in markAsSeen: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const createGroup = async (req, res) => {
    try {
        const { name, members, groupPic } = req.body;
        const adminId = req.user._id;

        let imageUrl = "";
        if (groupPic) {
            const uploadResponse = await cloudinary.uploader.upload(groupPic);
            imageUrl = uploadResponse.secure_url;
        }

        const newGroup = new Group({
            name,
            admin: adminId,
            members: [...new Set([...members, adminId])],
            groupPic: imageUrl,
        });

        await newGroup.save();
        res.status(201).json(newGroup);
    } catch (error) {
        console.log("Error in createGroup controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getGroups = async (req, res) => {
    try {
        const userId = req.user._id;
        const groups = await Group.find({
            members: { $in: [userId] },
        }).populate("members", "-password").populate({
            path: "lastMessage",
            populate: {
                path: "senderId",
                select: "fullName profilePic",
            },
        });

        // Sort groups by last message date
        groups.sort((a, b) => {
            const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(0);
            const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(0);
            return dateB - dateA;
        });

        res.status(200).json(groups);
    } catch (error) {
        console.log("Error in getGroups controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const addMember = async (req, res) => {
    try {
        const { groupId, userId } = req.body;
        const group = await Group.findById(groupId);

        if (!group) return res.status(404).json({ message: "Group not found" });
        if (group.admin.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only admin can add members" });
        }

        if (group.members.includes(userId)) {
            return res.status(400).json({ message: "User already in group" });
        }

        group.members.push(userId);
        await group.save();

        res.status(200).json(group);
    } catch (error) {
        console.log("Error in addMember controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

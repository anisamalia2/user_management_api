import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import {
  getUsers as getUsersModel,
  uploadAvatar as uploadAvatarModel,
  updateUser as updateUserModel,
} from "../models/userModel.js";

export const getUsers = async (req, res) => {
  try {
    const rows = await getUsersModel();
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get users", error: err.message });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await uploadStream();
    const { id } = req.user;

    await uploadAvatarModel(result.secure_url, id);

    res.json({ message: "Avatar uploaded", url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.user;
    const { username, email } = req.body;

    const user = await updateUserModel(username, email, id);

    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

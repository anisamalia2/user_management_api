import pool from "../config/db.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const getUsers = async (req, res) => {
  const { rows } = await pool.query(
    "SELECT id, username, email, role, avatar_url FROM users"
  );
  res.json(rows);
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

    await pool.query("UPDATE users SET avatar_url = $1 WHERE id = $2", [
      result.secure_url,
      id,
    ]);

    res.json({ message: "Avatar uploaded", url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.user; // ID dari token
    const { username, email } = req.body;

    const result = await pool.query(
      "UPDATE users SET username = $1, email = $2, updated_at = NOW() WHERE id = $3 RETURNING id, username, email, updated_at",
      [username, email, id]
    );

    res.json({ message: "Profile updated", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

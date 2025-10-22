import pool from "../config/db.js";

export const getUsers = async () => {
  const { rows } = await pool.query(
    "SELECT id, username, email, role, avatar_url FROM users"
  );
  return rows;
};

export const uploadAvatar = async (avatarUrl, id) => {
  await pool.query("UPDATE users SET avatar_url = $1 WHERE id = $2", [
    avatarUrl,
    id,
  ]);
};

export const updateUser = async (username, email, id) => {
  const result = await pool.query(
    "UPDATE users SET username = $1, email = $2, updated_at = NOW() WHERE id = $3 RETURNING id, username, email, updated_at",
    [username, email, id]
  );
  return result.rows[0];
};

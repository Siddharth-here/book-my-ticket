
import bcrypt from "bcrypt";
import { pool } from "../db/pool.js";
import { signToken } from "../utils/jwt.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: { message: "Name, email, and password are required" } });
    }

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]);
    if (existing.rowCount > 0) {
      return res.status(409).json({ error: { message: "Email is already registered" } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
      [name, email.toLowerCase(), hashedPassword]
    );

    return res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: { message: "Internal Server Error" } });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: { message: "Email and password are required" } });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    if (result.rowCount === 0) {
      return res.status(401).json({ error: { message: "Invalid credentials" } });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: { message: "Invalid credentials" } });
    }

    const token = signToken({ userId: user.id, email: user.email, name: user.name });
    return res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: { message: "Internal Server Error" } });
  }
};

export const getMe = (req, res) => {
  return res.status(200).json({ user: req.user });
};
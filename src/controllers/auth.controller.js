// src/controllers/auth.controller.js
import bcrypt from "bcrypt";
import { users } from "../db/pool.js";
import { signToken } from "../utils/jwt.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: { message: "Name, email, and password are required" } });
    }

    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ error: { message: "Email is already registered" } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      created_at: new Date().toISOString()
    };

    users.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json({ user: userWithoutPassword });
  } catch (err) {
    return res.status(500).json({ error: { message: err.message || "Internal Server Error" } });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: { message: "Email and password are required" } });
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: { message: "Invalid credentials" } });
    }

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
    return res.status(500).json({ error: { message: err.message || "Internal Server Error" } });
  }
};

export const getMe = (req, res) => {
  return res.status(200).json({ user: req.user });
};
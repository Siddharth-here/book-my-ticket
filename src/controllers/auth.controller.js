import bcrypt from "bcrypt";
import { users } from "../db/data.js";
import { signinToken } from "../utils/jwt.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: { message: "Name, email, and password are required " },
      });
    }

    const existingUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (existingUser) {
      return res
        .status(409)
        .json({ error: { message: "Email already registered" } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json({ user: userWithoutPassword });

    users.push(newUser);
  } catch (error) {
    return res.status(500).json({ error: { message: error.message } });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(401)
        .json({ error: { message: "Email and password are required" } });
    }

    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (!user) {
      return res
        .status(401)
        .json({ error: { message: "Invalid credentials" } });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: { message: "Invalid credentials" } });
    }

    const token = signToken({ userId: user.id, email: user.email });
    const { password: _, ...userProfile } = user;

    return res.status(200).json({ token, user: userProfile });
  } catch (error) {
    return res.status(500).json({ error: { message: error.message } });
  }
};

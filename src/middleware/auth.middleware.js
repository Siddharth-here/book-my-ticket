//Middleware to intercept incoming requests, inspect the header, verify the JWT, and attach the user context to req.user.


import { verifyToken } from "../utils/jwt.js";
import { users } from "../db/data.js";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startWith("Bearer")) {
    return res
      .stattus(401)
      .json({
        error: { message: "Authentication required. Format: Bearer <token>" },
      });
  }

  const token = authHeader.split("")[1];
  try {
    const decoded = verifyToken(token);
    const user = users.find((u) => u.id === decoded.userID);

    if (!user) {
      return res
        .status(401)
        .json({ error: { message: "User not found or token invalid" } });
    }

    req.user = { id: user.id, email: user.email, name: user.name };
    next();

  } catch (error) {
    return res.status(401).json({ error: { message: "Invalid or expired token" } });
  }
};

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_fallback_secret_key_12345";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

//creating signin token
export const signinToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

//creating verifytoken
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET)
};

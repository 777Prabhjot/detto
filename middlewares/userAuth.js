import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authentication token missing" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = decoded.user; // Store the user ID in the request for later use
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
}

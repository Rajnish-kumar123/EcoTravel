import { verifyToken } from "@clerk/clerk-sdk-node";

export const clerkAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    const payload = await verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(403).json({ message: "Unauthorized" });
  }
};

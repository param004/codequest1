import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedData?.id || decodedData?.userId;
    next();
  } catch (error) {
    console.log("JWT Auth Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default auth;
const jwt = require("jsonwebtoken");
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwMTI1NjM3MSwiaWF0IjoxNzAxMjU2MzcxfQ.TrBKsx9Dhwy-dcaji2iBPjBhFusq1LvZp8hjfYSs0vQ";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Thiếu token hoặc không hợp lệ" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Gắn thông tin user vào req
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

module.exports = authMiddleware;

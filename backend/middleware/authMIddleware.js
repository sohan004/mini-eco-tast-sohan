const jwt = require("jsonwebtoken");
const authMiddleware = async (req, res, next) => {
  try {
    const headersToken =
      (await req.headers["authorization"]) || req.headers["Authorization"];
    const token = await headersToken?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorize Request" });
    }
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorize Request" });
  }
};

module.exports = authMiddleware;

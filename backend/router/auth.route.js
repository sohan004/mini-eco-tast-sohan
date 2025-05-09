const router = require("express").Router();

const {
  signup,
  login,
  logout,
  refreshToken,
  getInfo,
} = require("../controller/auth.controller");
const authMiddleware = require("../middleware/authMIddleware");

router.post("/signup", signup);
router.post("/login", login);
router.put("/logout", authMiddleware, logout);
router.post("/refresh-access-token", refreshToken);
router.get("/info", authMiddleware, getInfo);


module.exports = router;
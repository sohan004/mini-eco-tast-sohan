const { db } = require("../db.config");
const asyncErrorCatcher = require("../middleware/asyncErrorCatcher");
const {
  generateNewJsonToken,
  verifyToken,
} = require("../utilities/generateNewJsonToken");
const {
  getHashPassword,
  comparePassword,
} = require("../utilities/genHashPassword");

module.exports.signup = asyncErrorCatcher(async (req, res) => {
  const { name, email, password , phone, address} = req.body;

  const userExists = await db.user.findUnique({
    where: { email },
  });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await getHashPassword(password);

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    },
  });

  res.json({ message: "User registered", success: true });
});

module.exports.login = asyncErrorCatcher(async (req, res) => {
  const { email, password } = req.body;

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const accessToken = generateNewJsonToken(user.id, "1m");
  const refreshToken = generateNewJsonToken(user.id, "7d");

  await db.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    accessToken,
    message: "Login successful",
    data: {
      name: user.name,
      email: user.email,
    },
    success: true,
  });
});

module.exports.logout = asyncErrorCatcher(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const user = await db.user.findFirst({
    where: { refreshToken },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  await db.user.update({
    where: { id: user.id },
    data: { refreshToken: "" },
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.json({ message: "Logout successful", success: true });
});

module.exports.refreshToken = asyncErrorCatcher(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const user = await db.user.findFirst({
    where: { refreshToken },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isValidRefreshToken = await verifyToken(refreshToken);
  if (!isValidRefreshToken) {
    return res.status(400).json({ message: "Invalid token" });
  }

  const accessToken = generateNewJsonToken(user.id, "1m");
  const newRefreshToken = generateNewJsonToken(user.id, "7d");

  await db.user.update({
    where: { id: user.id },
    data: { refreshToken: newRefreshToken },
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    accessToken,
    message: "Token refreshed",
    success: true,
  });
});

module.exports.getInfo = asyncErrorCatcher(async (req, res) => {
  const id = req.user.id;

  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.json({ user, success: true });
});

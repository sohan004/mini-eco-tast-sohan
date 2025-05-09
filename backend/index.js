// node js version 20.7.0
const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const geoip = require("geoip-lite");
const { getCountries } = require("node-countries");
const { allowedDomains } = require("./constant/constant");

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedDomains.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./temp/",
  })
);

app.use("/", (req, res, next) => {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
  const geo = geoip.lookup(ip)?.country || "BD";
  const country = getCountries().find((c) => {
    if (c?.alpha2?.toLowerCase() === geo?.toLowerCase()) return c;
    else if (c?.alpha3?.toLowerCase() === geo?.toLowerCase()) return c;
    else if (c?.name?.toLowerCase() === geo?.toLowerCase()) return c;
  });
  const countryName = country?.name?.toLowerCase();
  req.country = countryName;
  next();
});

// Routes
app.use("/api/v1", require("./router/route"));

app.get("/ip", async (req, res) => {
  try {
    const country = await req.country;
    res.json({ country });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

app.post("/webhook", async (req, res) => {
  console.log("webhook receive====>>>", req.body);
  res.status(200).send("Webhook received");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal server error" });
});

module.exports = { app };

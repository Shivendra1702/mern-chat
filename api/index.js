require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const app = express();
const connectDB = require("./config/db");

// connect db
connectDB();

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://127.0.0.1:5173",
  })
);

//routes
app.post(`/api/v1/register`, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Missing fields",
      });
    }
    const checkEmail = await User.findOne({ email });

    if (checkEmail) {
      return res.status(400).json({
        ok: false,
        message: "Email already exists",
      });
    }
    const newUser = await User.create(req.body);
    const token = await newUser.getJwtToken();

    newUser.password = undefined;

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      })
      .json({
        ok: true,
        message: "User registered successfully",
        newUser,
        token,
      });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: `Error Registering User: ${error}`,
    });
  }
});

app.post(`/api/v1/login`, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({
        ok: false,
        message: "Missing fields",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "User not found",
      });
    }

    const isPasswordValid = user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        ok: false,
        message: "Invalid password",
      });
    }

    const token = await user.getJwtToken();
    user.password = undefined;

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      })
      .json({
        ok: true,
        message: "User logged in successfully",
        user,
        token,
      });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: `Error logging in user: ${error}`,
    });
  }
});

app.get(`/api/v1/logout`, async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({
        ok: true,
        message: "User logged out successfully",
      });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: `Error logging out user: ${error}`,
    });
  }
});

app.get(`/api/v1/profile`, async (req, res) => {
  try {
    const { token } = req.cookies;
    const payload = jwt.verify(token, process.env.JWT_SECRET, {});

    if (!payload) {
      return res.status(401).json({
        ok: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(payload.id);

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      ok: true,
      user,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: `Error getting user profile: ${error}`,
    });
  }
});

//listen
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
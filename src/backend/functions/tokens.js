const jwt = require("jsonwebtoken");
const User = require("../models/User");

const genTokens = async (req, res, user) => {
  const refreshTokenCookie = req.cookies.refreshToken;
  if (refreshTokenCookie && !isTokenExpired("REFRESH", req)) {
    const decoded = jwt.verify(refreshTokenCookie, process.env.REFRESH);
    const user = await User.findOne({ username: req.body.username });
    if (decoded && user && user.username == decoded.username) {
      if (user.refreshTokens.indexOf(refreshTokenCookie) >= 0) {
        console.log("already logged in");
        return refreshTokenCookie;
      }
    }
  }
  // Create refresh token
  const refreshToken = jwt.sign(
    { username: user.username, id: user._id },
    process.env.REFRESH,
    {
      expiresIn: "1d",
    }
  );
  // Create access token
  const accessToken = jwt.sign(
    { username: user.username, id: user._id },
    process.env.ACCESS,
    {
      expiresIn: "60s",
    }
  );
  if (!user.refreshTokens) user.refreshTokens = [];
  // Set refreshToken as a cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  // Set accessToken as a cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 1000 * 60,
  });
  // Associate refresh token with the user
  user.refreshTokens.push(refreshToken);
  // save token to user
  await user.save();
  return refreshToken;
};

const refreshAccessToken = async (req, res) => {
  try {
    // Check if refreshToken cookie exists or is expired
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
      console.log("refreshToken cookie not found or expired");
      return res.sendStatus(401);
    }

    const refreshToken = cookies.refreshToken;
    if (isTokenExpired("REFRESH", req)) {
      console.log("refresh token expired");
      return res.sendStatus(401);
    }

    // Check if accessToken cookie exists and is not expired
    if (cookies?.accessToken && !isTokenExpired("ACCESS", req)) {
      console.log("access token not expired");
      return res.sendStatus(200);
    }

    // Find user with token
    const user = await User.findOne({
      refreshTokens: { $in: [refreshToken] },
    }).exec();

    if (!user) {
      console.log("User not found with the provided refresh token");
      return res.sendStatus(403);
    }

    // Decode refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH);
    if (!decoded || !user || user.username !== decoded.username) {
      return 403; // Invalid refresh token or user not found
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { username: user.username, id: user._id },
      process.env.ACCESS,
      { expiresIn: "60s" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1000 * 60,
    });

    console.log("new access: " + accessToken);
    return res.sendStatus(200);
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.sendStatus(500); // Internal Server Error
  }
};

const isTokenExpired = (tokenType, req) => {
  try {
    const token = req.cookies[tokenType.toLowerCase() + "Token"];
    if (!token) return true;
    const decoded = jwt.verify(token, process.env[tokenType.toUpperCase()]);
    return decoded.exp < Date.now() / 1000; // Expiration time is in seconds
  } catch (error) {
    return true;
  }
};

module.exports = { genTokens, refreshAccessToken, isTokenExpired };

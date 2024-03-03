const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let User = require("../models/User");

// Get a list of all users on the database
router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});
// Add a user to the database
router.route("/register").post(async (req, res) => {
    // Get input
    const { username, password } = req.body;
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Add user
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    try {
      // Save user to the database
      await newUser.save();
      // Create access token
      const accessToken = jwt.sign({ username: newUser.username }, process.env.ACCESS, {
        expiresIn: "2m",
      });
      // Create refresh token
      const refreshToken = jwt.sign({ username: newUser.username }, process.env.REFRESH, {
        expiresIn: "1d",
      });
      // Associate refresh token with the user
      newUser.refreshTokens.push(refreshToken);
      await newUser.save();
      // Set refreshToken as a cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        // secure: true, //uncomment when done
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });
      // Send response with access token
      res.json({ message: "User registered successfully.", accessToken });
    } catch (err) {
      console.error("Error registering user:", err);
      res.status(400).json("Error: " + err);
    }
  });
  
router.route("/login").post(async (req, res) => {
  // get input
  const { username, password } = req.body;
  // check input
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  //find user
  const user = await User.findOne({ username });
  if (!user) return res.sendStatus(401); //Unauthorized
  //check password
  const validPassword = await bcrypt
    .compare(password, user.password)
    .catch((err) => res.status(400).json("Error: " + err));
  if (validPassword) {
    // create access & refresh token
    const accessToken = jwt.sign({ username: username }, process.env.ACCESS, {
      expiresIn: "2m",
    });
    const refreshToken = jwt.sign({ username: username }, process.env.REFRESH, {
      expiresIn: "1d",
    });
    if (!user.refreshTokens) user.refreshTokens = [];
    user.refreshTokens.push(refreshToken);
    const result = await user.save();
    console.log(result);
    // create cookie w/ refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: true, //uncomment when done
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ message: "Authentication successful.", accessToken });
  } else res.status(401).json("Invalid username or password");
});
router.route("/refresh").get(async (req, res) => {
    const cookies = req.cookies;
    
    // Check if refreshToken cookie exists
    if (!cookies?.refreshToken) return res.sendStatus(401);
    
    const refreshToken = cookies.refreshToken;
    
    try {
      // Find user with token
      const user = await User.findOne({
        refreshTokens: { $in: [refreshToken] }
      }).exec();
      if (!user) {
        return res.sendStatus(403); // User not found with the provided refresh token
      }
      // Verify refresh token
      jwt.verify(refreshToken, process.env.REFRESH, (err, decoded) => {
        if (err || !decoded || user.username !== decoded.username) {
          return res.sendStatus(403); // Invalid refresh token or user not found
        }
        // Generate new access token
        const accessToken = jwt.sign(
          { username: decoded.username },
          process.env.ACCESS,
          { expiresIn: "2m" }
        );
        // Respond with new access token
        res.json({ accessToken });
      });
    } catch (error) {
      console.error("Error refreshing token:", error);
      return res.sendStatus(500); // Internal Server Error
    }
  });
router.post("/logout", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(204); // No content
  const refreshToken = cookies.refreshToken;

  // Find the user with the matching refreshToken
  const user = await User.findOne({ refreshTokens: refreshToken }).exec();
  if (!user) {
    // If the user with the refreshToken is not found, clear the cookie and return
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return res.sendStatus(204);
  }
  console.log("User before removal: ", user);
  // remove refreshToken from array
  const index = user.refreshTokens.indexOf(refreshToken);
  if (index !== -1) {
    user.refreshTokens.splice(index, 1);
  }
  console.log("User after removal: ", user);
  // Save the updated user object
  const result = await user.save();
  console.log("Result after save: ", result);
  // Clear the cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  console.log("removed: " + refreshToken);
  return res.sendStatus(204);
});

module.exports = router;

// Add a club's id to user's list
router.route("/add/:id").post((req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      user.clubList.push(req.body.clubId);
      user
        .save()
        .then(() => res.json("Added " + req.body.clubId))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.json("Error: " + err));
});
// Get information on a specific user
router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});
// Update a user entry
router.route("/update/:id").put(async (req, res) => {
  // Get input
  const { username, password } = req.body;
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // Add user
  User.findByIdAndUpdate(req.params.id, {
    username: username,
    password: hashedPassword,
  })
    .then(() => res.json("Updated: " + username))
    .catch((err) => res.json("Error: " + err));
});
// Delete a user entry
router.route("/:id").delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((user) => res.json("Deleted " + user.username))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;

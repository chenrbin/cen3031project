const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let User = require("../models/User");
let Club = require("../models/Club");

// Get a list of all users on the database
router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});
// Add a user to the database
router.route("/register").post(async (req, res) => {
  try {
    // Get input
    const { username, password } = req.body;
    // Check if username already exists
    const user = await User.findOne({ username });
    if (user)
      return res.status(409).json("Username " + username + " already exists");

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Add user
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    // Save user to the database
    await newUser.save();
    // Create access token
    const accessToken = jwt.sign(
      { username: newUser.username },
      process.env.ACCESS,
      {
        expiresIn: "2m",
      }
    );
    // Create refresh token
    const refreshToken = jwt.sign(
      { username: newUser.username },
      process.env.REFRESH,
      {
        expiresIn: "1d",
      }
    );
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
    res.status(400).json("Error: " + err);
  }
});

// Attempt to log in
router.route("/login").post(async (req, res) => {
  // Get input
  const { username, password } = req.body;
  // Check that both username and password are provided
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  try {
    // Find user
    const user = await User.findOne({ username });
    // If username does not exist
    if (!user) return res.status(401).json("Invalid username or password"); //Unauthorized
    // Check password
    const validPassword = await bcrypt
      .compare(password, user.password)
      .catch((err) => res.status(400).json("Error: " + err));
    if (validPassword) {
      // Create access & refresh token
      const accessToken = jwt.sign({ username: username }, process.env.ACCESS, {
        expiresIn: "2m",
      });
      const refreshToken = jwt.sign(
        { username: username },
        process.env.REFRESH,
        {
          expiresIn: "1d",
        }
      );
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
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});
router.route("/refresh").get(async (req, res) => {
  const cookies = req.cookies;

  // Check if refreshToken cookie exists
  if (!cookies?.refreshToken) return res.sendStatus(401);

  const refreshToken = cookies.refreshToken;

  try {
    // Find user with token
    const user = await User.findOne({
      refreshTokens: { $in: [refreshToken] },
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
router.route("/logout").post(async (req, res) => {
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
// Add a club to user's list by clubName. Used for testing.
router.route("/add/clubname/:id").post((req, res) => {
  // Find user by id
  User.findById(req.params.id)
    .then((user) => {
      // Check if user does not exist
      if (!user)
        return res
          .status(404)
          .json("UserID " + req.params.id + " does not exist");
      // Find club
      Club.findOne({ clubName: req.body.clubName })
        .then((club) => {
          // Check if club does not exist
          if (!club)
            return res
              .status(404)
              .json("Club " + req.body.clubName + " does not exist");
          // Check if user already has club in their list
          if (user.clubList.includes(club.id))
            res.status(409).json("Club " + club.clubName + " is already added");
          else {
            // Add club to list and save
            user.clubList.push(club.id);
            user
              .save()
              .then(() => res.json("Added " + club.clubName))
              .catch((err) => res.status(400).json("Error: " + err));
          }
        })
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.json("Error: " + err));
});
// Add a club's id to user's list. :id is for user. Club id is in body
router.route("/add/:id").post((req, res) => {
  // Find user by id
  User.findById(req.params.id)
    .then((user) => {
      // Check if user does not exist
      if (!user)
        return res
          .status(404)
          .json("UserID " + req.params.id + " does not exist");
      clubId = req.body.clubId;
      // Check if user already has club in their list
      if (user.clubList.includes(clubId))
        return res.status(409).json("ClubId " + clubId + " is already added");

      // Check that club exists
      Club.findById(clubId)
        .then((club) => {
          // Return if club does not exist
          if (!club)
            return res.status(404).json("ClubID " + clubId + " does not exist");
          // Add club to list and save
          user.clubList.push(clubId);
          user
            .save()
            .then(() => {
              res.json("Added " + club.clubName);
            })
            .catch((err) => res.status(400).json("Error: " + err));
        })
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.json("Error: " + err));
});
// Remove a club's id from user's list. :id is for user. Club id is in body
router.route("/remove/:id").post((req, res) => {
  // Find user by id
  User.findById(req.params.id)
    .then((user) => {
      // Check if user does not exist
      if (!user)
        return res
          .status(404)
          .json("UserID " + req.params.id + " does not exist");
      clubId = req.body.clubId;
      let index = user.clubList.indexOf(req.body.clubId);
      if (index == -1)
        return res.status(404).json("ClubID " + clubId + " not in list");
      // Check that club exists
      Club.findById(clubId)
        .then((club) => {
          // Remove club from list and save
          user.clubList.splice(index, 1);
          user
            .save()
            .then(() => {
              if (!club)
                return res.status(404).json("Removed from clubList. Warning: ClubID " + clubId + " does not exist");
              res.json("Removed " + club.clubName);
            })
            .catch((err) => res.status(400).json("Error: " + err));
          // Return if club does not exist
          
          
        })
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.json("Error: " + err));
});
// Add a club's id to user's list
router.route("/clear/:id").post((req, res) => {
  // Find user by id
  User.findById(req.params.id)
    .then((user) => {
      if (!user)
        return res
          .status(404)
          .json("User " + req.body.username + " does not exist");
      user.clubList = [];
      user
        .save()
        .then(res.json("Club list for " + user.username + " cleared"))
        .catch((err) => res.json("Error: " + err));
    })
    .catch((err) => res.json("Error: " + err));
});
// Get information of all clubs on a user's list.
// Returns an array of json objects
router.route("/list/:id").get((req, res) => {
  // Find user by id
  User.findById(req.params.id)
    .then(async (user) => {
      if (!user)
        return res
          .status(404)
          .json("User " + req.params.id + " does not exist");
      let listJson = [];
      for (club of user.clubList) {
        const entry = await Club.findById(club);
        listJson.push(entry);
      }
      console.log(listJson);
      res.json(listJson);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});
// Search for username and get information
router.route("/lookup").get((req, res) => {
  username = req.body.username
  User.findOne({username})
  .then(user => {
    if (!user)
      return res.status(404).json("Username " + username + " not found.")
    res.json(user);
  })
  .catch(err => res.status(400).json("Error: " + err));
});
// Get information on a specific user
router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user)
        return res
          .status(404)
          .json("UserID " + req.params.id + " does not exist");
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
    .then((user) => {
      if (!user)
        res.status(404).json("UserID " + req.params.id + " does not exist");
      else res.json("Updated " + req.body.username);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});
// Alternate delete route using name. Used for testing.
router.route("/delete").delete((req, res) => {
  User.findOneAndDelete(req.body.username)
    .then((user) => {
      if (!user)
        res.status(404).json("User " + req.body.username + " does not exist");
      else res.json("Deleted " + user.username);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});
// Delete a user entry using id
router.route("/:id").delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      if (!user)
        res.status(404).json("UserID " + req.params.id + " does not exist");
      else res.json("Deleted " + user.username);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});
module.exports = router;

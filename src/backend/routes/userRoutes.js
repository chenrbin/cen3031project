const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Club = require("../models/Club");
const tokens = require("../functions/tokens");

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

    // Create access & refresh token
    await tokens.genTokens(req, res, newUser);

    // Save user to the database
    await newUser.save();
    res.status(200).json({
      message: "User registered successfully.",
      id: newUser.id,
      refreshToken: newUser.refreshTokens,
    });
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
      refreshToken = await tokens.genTokens(req, res, user);

      res.json({ message: "Authentication successful.", refreshToken });
    } else res.status(401).json("Invalid username or password");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// generate a new access token using refresh token if current acess token is expired
router.route("/refresh").get(async (req, res) => {
  await tokens.refreshAccessToken(req, res);
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
  // remove refreshToken from array
  const index = user.refreshTokens.indexOf(refreshToken);
  if (index !== -1) {
    user.refreshTokens.splice(index, 1);
  }
  // Save the updated user object
  const result = await user.save();
  // Clear the cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  return res.status(204).json("removed: " + refreshToken);
});
// Search for username and get information
router.route("/lookup").get((req, res) => {
  username = req.body.username;
  User.findOne({ username })
    .then((user) => {
      if (!user)
        return res.status(404).json("Username " + username + " not found.");
      res.json(user);
    })
    .catch((err) => res.status(400).json("Error: " + err));
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

// check for access token for everything below this
// Add a club's id to user's list. :id is for user. Club id is in body
router.route("/add/:id").post((req, res) => {
  // authorize access token
  const access = req.cookies.accessToken;
  if (tokens.isTokenExpired("ACCESS", req)) {
    return res.status(404).json("Access Expired");
  }
  // Find user by id
  User.findById(req.params.id)
    .then((user) => {
      const decoded = jwt.verify(access, process.env.ACCESS);
      if (!decoded || !user || user.username !== decoded.username)
        if (!user)
          // Check if user does not exist
          return res
            .status(404)
            .json("UserID " + req.params.id + " does not exist");
      const clubId = req.body.clubId;
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
                return res
                  .status(404)
                  .json(
                    "Removed from clubList. Warning: ClubID " +
                      clubId +
                      " does not exist"
                  );
              res.json("Removed " + club.clubName);
            })
            .catch((err) => res.status(400).json("Error: " + err));
          // Return if club does not exist
        })
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.json("Error: " + err));
});
// Clear user's club list
router.route("/clear/:id").post((req, res) => {
  // authorize access token
  const access = req.cookies.accessToken;
  if (tokens.isTokenExpired("ACCESS", req)) {
    return res.status(404).json("Access Expired");
  }
  // Find user by id
  User.findById(req.params.id)
    .then((user) => {
      const decoded = jwt.verify(access, process.env.ACCESS);
      if (!decoded || !user || user.username !== decoded.username)
        return res
          .status(403)
          .json("Invalid: " + req.params.id + " doesn't match or exist");
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
  // authorize access token
  const access = req.cookies.accessToken;
  if (tokens.isTokenExpired("ACCESS", req)) {
    return res.status(404).json("Access Expired");
  }
  const decoded = jwt.verify(access, process.env.ACCESS);
  // Find user by id
  User.findById(req.params.id)
    .then(async (user) => {
      if (!decoded || !user || user.username !== decoded.username)
        return res
          .status(403)
          .json("Invalid: " + req.params.id + " doesn't match or exist");
      if (!user)
        return res
          .status(404)
          .json("User " + req.params.id + " does not exist");
      let listJson = [];
      for (club of user.clubList) {
        const entry = await Club.findById(club);
        listJson.push(entry);
      }
      res.json(listJson);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Return a single club's info as recommendation, based on user clublist
router.route("/recommend/:id").get((req, res) => {
  // Get user from id
  User.findById(req.params.id)
    .then((user) => {
      if (!user)
        return res.status(404).json("Username " + username + " not found.");
      let clubList = user.clubList;



      // Make a list of the clubs' categories as weights for recommendation
      let categoryList = [];
      for (let clubId of clubList) {
        Club.findById(clubId).then((club) => {
          if (club) {
            categoryList.push(club.category);
          }
        });
      }

      // Select a random category from the user's list to recommend
      let randomIndex = Math.floor(Math.random() * categoryList.length);
      let randomCategory = categoryList[randomIndex];
      // Exclude clubs already on the list
      Club.findOne({ category: randomCategory, _id: { $nin: clubList } }).then(
        (club) => {
          // 10% chance to recommend a true random club
          const randomRecommendationChance = 0.1;
          let selectTrueRandomClub =
            Math.floor(Math.random() * (1 / randomRecommendationChance)) == 0;
          if (!club || selectTrueRandomClub) {
            console.log(club);
            // If the 10% is rolled, or if no club of the random category is found, select random
            Club.findOne({_id: { $nin: clubList }} )
            .then((randomClub) => {
              if (!randomClub) {
                return res.status(404).json("No clubs to recommend");
              } else {
                // Return club
                console.log("Return random");
                res.json(randomClub);
              }
            });
          } else {
            // Else, return club json
            res.json(club);
            console.log("return null");
          }
        }
      );
    })
    .catch((err) => res.status(400).json("Error: " + err));
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

// Update a user entry (username/password)
router.route("/update/:id").put(async (req, res) => {
  // authorize access token
  const access = req.cookies.accessToken;
  if (tokens.isTokenExpired("ACCESS", req)) {
    return res.status(404).json("Access Expired");
  }
  const decoded = jwt.verify(access, process.env.ACCESS);
  const user = await User.findById(req.params.id);
  if (!decoded || !user || user.username !== decoded.username) {
    return res
      .status(403)
      .json("Invalid: " + req.params.id + " doesn't match or exist");
  }
  // Get input
  const { username, password } = req.body;
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // Add user
  user.set({ username, password: hashedPassword });
  try {
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    return res
      .status(404)
      .json("Error updating (maybe duplicate username name) " + error);
  }
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

// Delete a user by id
router.route("/:id").delete(async (req, res) => {
  // authorize access token
  const access = req.cookies.accessToken;
  if (tokens.isTokenExpired("ACCESS", req)) {
    return res.status(404).json("Access Expired");
  }
  const decoded = jwt.verify(access, process.env.ACCESS);
  const user = await User.findById(req.params.id);
  if (!decoded || !user || user.username !== decoded.username) {
    return res
      .status(403)
      .json("Invalid: " + req.params.id + " doesn't match or exist");
  }

  // prevent delete if user owns clubs
  const club = await Club.findOne({ owner: user.id });
  if (club !== null) {
    return res
      .status(423)
      .json("Cannot delete " + req.params.id + ": owner of club(s).");
  }

  try {
    await user.deleteOne();
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json("Deleted " + user.username);
  } catch (error) {
    return res.status(404).json(error);
  }
});
module.exports = router;

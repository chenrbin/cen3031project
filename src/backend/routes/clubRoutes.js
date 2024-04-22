const router = require("express").Router();
const Club = require("../models/Club");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const tokens = require("../functions/tokens");

// Get a list of all clubs on the database
router.route("/").get((req, res) => {
  Club.find()
    .then((clubs) => res.json(clubs))
    .catch((err) => res.status(400).json("Error: " + err));
});
// Get the list of all clubs with a specified category
router.route("/find/category").get((req, res) => {
  if (!req.query.category)
    return res.status(400).json("Missing category parameter");
  Club.find({ category: req.query.category.toString() })
    .then((clubList) => {
      if (clubList.length === 0) return res.status(404).json("No clubs found");
      res.json(clubList);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Search for a club name with fuzzy search
router.route("/find/clubname").get((req, res) => {
  if (!req.query.clubName)
    return res.status(400).json("Missing clubName parameter");
  Club.fuzzySearch(req.query.clubName)
    .then((clubList) => {
      if (clubList.length === 0) return res.status(404).json("No clubs found");
      res.json(clubList);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Search for exact club name and get information
router.route("/lookup").get((req, res) => {
  const clubName = req.body.clubName.toString();
  Club.findOne({ clubName })
    .then((club) => {
      if (!club)
        return res.status(404).json("Club " + clubName + " not found.");
      res.json(club);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Get a club's information from its id
router.route("/:id").get((req, res) => {
  Club.findById(req.params.id)
    .then((serv) => {
      if (!serv)
        return res.status(404).json("ClubId " + req.params.id + " not found");
      res.json(serv);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Create a club in the database
router.route("/create").post((req, res) => {
  // authorize access token
  const access = req.cookies.accessToken;
  if (tokens.isTokenExpired("ACCESS", req)) {
    return res.status(404).json("Access Expired");
  }
  const decoded = jwt.verify(access, process.env.ACCESS);
  if (!decoded) {
    return res.status(403).json("Access expired");
  }
  // Clubs are stored not all lowercase. Front end will convert to lowercase for searching
  const clubName = req.body.clubName.trim().toString(); 
  if (clubName.length < 1) { // min clubName
    return res.status(400).json("Club name must be at least 1 character long");
  }
  User.findOne({ username: decoded.username }).then((owner) => {
    const newClub = new Club({
      ...req.body,
      clubName: clubName,
      category: req.body.category.trim().toString(),
      owner: owner.id,
    });
    newClub
      .save()
      .then(() =>
        res.json("Club " + newClub.clubName + " (" + newClub.id + ") created")
      )
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

// Get information on a specific club
router.route("/update/:id").put(async (req, res) => {
  // authorize access token
  const access = req.cookies.accessToken;
  if (tokens.isTokenExpired("ACCESS", req)) {
    return res.status(404).json("Access Expired");
  }
  // get username from access token
  const decoded = jwt.verify(access, process.env.ACCESS);
  // check if club exists and if club owner == username
  let club = await Club.findById(req.params.id);
  if (!club)
    return res.status(404).json("ClubID " + req.params.id + " does not exist");
  if (club.owner !== decoded.username)
    return res.status(404).json("Not owner of ClubID " + req.params.id);

  club.set(req.body);
  try {
    await club.save();
    res.status(200).json(club);
  } catch (error) {
    return res
      .status(404)
      .json("Error updating (maybe duplicate club name) " + req.params.id);
  }
});

// Alternate delete route using name. Used for testing.
router.route("/delete").delete((req, res) => {
  Club.findOneAndDelete({clubName: req.body.clubName.toString()})
    .then((club) => {
      if (!club)
        return res
          .status(404)
          .json("Club " + req.body.clubName + " does not exist");
      res.json("Deleted " + club.clubName);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});
// Delete a club entry
router.route("/:id").delete(async (req, res) => {
  // authorize access token
  const access = req.cookies.accessToken;
  if (tokens.isTokenExpired("ACCESS", req)) {
    return res.status(404).json("Access Expired");
  }
  // get username from access token
  const decoded = jwt.verify(access, process.env.ACCESS);
  // check if club exists and if club owner == username
  let club = await Club.findById(req.params.id);
  if (!club)
    return res.status(404).json("ClubID " + req.params.id + " does not exist");
  User.findOne({ username: decoded.username }).then(async (user) => {
    if (club.owner !== user.id)
      return res.status(404).json("Not owner of ClubID " + req.params.id);
    try {
      res.json("Deleted " + club.clubName);
      await club.deleteOne();
    } catch (error) {
      return res.status(404).json(error);
    }
  });
});
module.exports = router;

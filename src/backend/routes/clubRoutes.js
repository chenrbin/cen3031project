const router = require("express").Router();
let Club = require("../models/Club");

// Get a list of all clubs on the database
router.route("/").get((req, res) => {
  Club.find()
    .then((clubs) => res.json(clubs))
    .catch(err => res.status(400).json("Error: " + err));
});
// Get the list of all clubs with a specified category
router.route("/find/category").get((req, res) => {
  if (!req.body.category)
    return res.status(400).json("Missing category parameter");
  Club.find({ category: req.body.category })
    .then((clubList) => {
      if (clubList.length === 0) return res.status(404).json("No clubs found");
      res.json(clubList);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});
// Search for a club name with fuzzy search
router.route("/find/club").get((req, res) => {
  Club.fuzzySearch(req.body.clubName)
    .then((clubList) => {
      if (clubList.length === 0) return res.status(404).json("No clubs found");
      res.json(clubList);
    })
    .catch(err => res.status(400).json("Error: " + err));
});
// Search for exact club name and get information
router.route("/lookup").get((req, res) => {
  clubName = req.body.clubName
  Club.findOne({clubName})
  .then(club => {
    if (!club)
      return res.status(404).json("Club " + clubName + " not found.")
    res.json(club);
  })
  .catch(err => res.status(400).json("Error: " + err));
});
// Get a club's information from its id
router.route("/:id").get((req, res) => {
  Club.findById(req.params.id)
    .then((serv) => {
      if (!serv)
        return res.status(404).json("ClubId " + req.params.id + " not found");
      res.json(serv);
    })
    .catch(err => res.status(400).json("Error: " + err));
});
// Add a club to the database
router.route("/add").post((req, res) => {
  const newClub = new Club(req.body);
  newClub
    .save()
    .then(() => res.json("Club " + newClub.clubName + " added"))
    .catch(err => res.status(400).json("Error: " + err));
});
// Get information on a specific club
router.route("/update/:id").put((req, res) => {
  Club.findByIdAndUpdate(req.params.id, req.body)
    .then((updatedClub) => {
      if (!updatedClub)
        return res
          .status(404)
          .json("ClubID " + req.params.id + " does not exist");
      res.json("Updated " + updatedClub.clubName);
    })
    .catch(err => res.status(400).json("Error: " + err));
});
// Alternate delete route using name. Used for testing.
router.route("/delete").delete((req, res) => {
  Club.findOneAndDelete(req.body.clubName)
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
router.route("/:id").delete((req, res) => {
  Club.findByIdAndDelete(req.params.id)
    .then((club) => {
      if (!club)
        return res
          .status(404)
          .json("ClubID " + req.params.id + " does not exist");
      res.json("Deleted " + req.body.clubName);
    })
    .catch(err => res.status(400).json("Error: " + err));
});
module.exports = router;

const router = require("express").Router();
let Club = require("../models/Club");

// Get a list of all clubs on the database
router.route('/').get((req, res) => {
    Club.find()
        .then(clubs => res.json(clubs))
        .catch(err => res.status(400).json('Error: ' + err));
});
// Get a club's information from its id
router.route('/:id').get((req, res) => {
    Club.findById()
        .then(serv => res.json(serv))
        .catch(err => res.status(400).json('Error: ' + err));
});
// Get the list of all clubs with a specified category
router.route('/find/category').get((req, res) => {
    if (!req.body.category)
        return res.status(400).json("Missing category parameter");
    Club.find({ category: req.body.category })
        .then(clubList => {
            if (clubList.length === 0)
                return res.status(404).json("No clubs found");
            res.json(clubList)
        })
        .catch(err => res.status(400).json('Error: ' + err));
});
// Search for a club name with fuzzy search
router.route('/find/club').get((req, res) => {
    Club.fuzzySearch(req.body.clubName)
        .then(clubList =>{ 
            if (clubList.length === 0)
                return res.status(404).json("No clubs found")
            res.json(clubList);
        })
        .catch(err => res.status(400).json('Error: ' + err))
});
// Add a club to the database
router.route('/add').post((req, res) => {
    const newClub = new Club(req.body);
    newClub.save()
        .then(() => res.json('Club ' + newClub.clubName + ' added'))
        .catch(err => res.status(400).json('Error: ' + err));
});
// Get information on a specific club
router.route('/update/:id').put((req, res) => {
    Club.findByIdAndUpdate(req.params.id, req.body)
        .then(updatedServ => {
            if (!updatedServ)
                return res.status(404).json('Error: Club not found');
            res.json('Updated ' + updatedServ.clubName);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});
// Delete a club entry
router.route('/:id').delete((req, res) => {
    Club.findByIdAndDelete(req.params.id)
        .then(serv => res.json('Deleted ' + serv.clubName))
        .catch(err => res.status(400).json('Error: ' + err));
});
module.exports = router;
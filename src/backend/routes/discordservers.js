const router = require("express").Router();
let DiscordServer = require("../models/discordserver.model");

// Get a list of all servers on the database
router.route('/').get((req, res) => {
    DiscordServer.find()
        .then(servers => res.json(servers))
        .catch(err => res.status(400).json('Error: ' + err));
});
// Get a server's information from its id
router.route('/:id').get((req, res) => {
    DiscordServer.findById()
        .then(serv => res.json(serv))
        .catch(err => res.status(400).json('Error: ' + err));
});
// Get the list of all servers with a specified category
router.route('/find/category').get((req, res) => {
    if (!req.body.category)
        return res.status(400).json("Missing category parameter");
    DiscordServer.find({ category: req.body.category })
        .then(serverList => {
            if (serverList.length === 0)
                return res.status(404).json("No servers found");
            res.json(serverList)
        })
        .catch(err => res.status(400).json('Error: ' + err));
});
// Search for a server name with fuzzy search
router.route('/find/server').get((req, res) => {
    DiscordServer.fuzzySearch(req.body.serverName)
        .then(serverList =>{ 
            if (serverList.length === 0)
                return res.status(404).json("No servers found")
            res.json(serverList);
        })
        .catch(err => res.status(400).json('Error: ' + err))
});
// Add a server to the database
router.route('/add').post((req, res) => {
    const newServer = new DiscordServer(req.body);
    newServer.save()
        .then(() => res.json('Server ' + newServer.serverName + ' added'))
        .catch(err => res.status(400).json('Error: ' + err));
});
// Get information on a specific server
router.route('/update/:id').put((req, res) => {
    DiscordServer.findByIdAndUpdate(req.params.id, req.body)
        .then(updatedServ => {
            if (!updatedServ)
                return res.status(404).json('Error: Server not found');
            res.json('Updated ' + updatedServ.serverName);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});
// Delete a server entry
router.route('/:id').delete((req, res) => {
    DiscordServer.findByIdAndDelete(req.params.id)
        .then(serv => res.json('Deleted ' + serv.serverName))
        .catch(err => res.status(400).json('Error: ' + err));
});
module.exports = router;
const router = require("express").Router();
let DiscordServer = require("../models/discordserver.model");

// Get a list of all servers on the database
router.route('/').get((req, res) => {
    DiscordServer.find()
        .then(servers => res.json(servers))
        .catch(err => res.status(400).json('Error: ' + err));
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
    DiscordServer.findByIdAndUpdate(req.params.id, req.body, {new: true})
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
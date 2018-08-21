var objectId = require('mongodb').ObjectID;
var Data = require('../models/data');

var dataService = {};
dataService.home = (req, res) => {
    res.sendFile("./index.html", {
        root: '.'
    });
};

dataService.list = function(req, res) {
    console.log(req.user);
    Data.find({
            isActive: true,
            owner: req.user._id,
            tags: {
                $regex: ".*" + req.query.filter + ".*",
                $options: "-i"
            }
        }).exec()
        .then(result => res.json(result))
        .catch(err => console.log(err));
};

dataService.signin = function(req, res) {
    res.sendFile("./singIn.html", {
        root: "."
    });
};

dataService.new = function(req, res) {
    console.log("New");
    if (req && req.body && req.params) {
        var rb = req.body;
        if (!rb.value) {
            return res.status(400).send("Не указано значение");
        }
        if (!rb.tags) {
            return res.status(400).send("Не указаны тэги");
        }

        var newData = new Data({
            tags: rb.tags,
            value: rb.value,
            isActive: true,
            owner: req.user._id,
            dateCreated: new Date(),
            dateChanged: new Date()
        });

        newData.save((err, result) => {
            if (err) { console.log; return; }
            res.status(200).send();
        });
    } else {
        return res.status(400).send("Не указаны необходимые параметры");
    }
};

dataService.edit = function(req, res) {
    console.log("Edit");
    console.log(req && req.body && req.params);
    if (req && req.body && req.params) {
        var rb = req.body;
        if (!rb.value) {
            return res.status(400).send("Не указано значение");
        }
        if (!rb.tags) {
            return res.status(400).send("Не указаны тэги");
        }

        Data.updateOne({
                _id: new objectId(req.params.id)
            }, {
                $set: {
                    tags: rb.tags,
                    value: rb.value,
                    dateChanged: new Date()
                }
            },
            function(err, result) {
                if (err) {
                    console.log(err);
                    return res.status(400).send(err);
                }

                console.log(result);
            }
        );
    } else {
        return res.status(400).send("Не указаны необходимые параметры");
    }
};

dataService.delete = function(req, res) {
    if (!req.params.id) {
        return res.status(400).send("Не указаны необходимые параметры");
    }

    Data.updateOne({
            _id: new objectId(req.params.id)
        }, {
            $set: {
                isActive: false,
                dateChanged: new Date()
            }
        },
        function(err, result) {
            if (err) {
                console.log(err);
                return res.status(400).send(err);
            }

            return res.status(200).send();
        }
    );
};

module.exports = { 'DataService': dataService };
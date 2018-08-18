var mongoClient = require("mongodb").MongoClient;
var objectId = require('mongodb').ObjectID;
var Data = require('../models/data');

var dataService = {};
dataService.home = (req, res) => {
    res.sendFile("./index.html", {
        root: '.'
    });
};

dataService.list = function(req, res) {
    console.log("getList");
    connect(function(client, collection) {
        collection.find({
            IsActive: true,
            Tags: {
                $regex: ".*" + req.query.filter.toLowerCase() + ".*"
            }
        }).toArray(function(err, results) {
            client.close();
            res.json(results);
        });
    });
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
        if (!rb.Value) {
            return res.status(400).send("Не указано значение");
        }
        if (!rb.Tags) {
            return res.status(400).send("Не указаны тэги");
        }

        connect(function(client, collection) {
            var entry = {
                Tags: rb.Tags,
                Value: rb.Value,
                IsActive: true
            };

            collection.insertOne(entry, function(err, result) {
                if (err) {
                    return console.log(err);
                }

                console.log(result.ops);
                client.close();
                return res.status(200).send();
            });
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
        if (!rb.Value) {
            return res.status(400).send("Не указано значение");
        }
        if (!rb.Tags) {
            return res.status(400).send("Не указаны тэги");
        }

        connect(function(client, collection) {
            console.log("update after connect ************************");
            collection.updateOne({
                    _id: new objectId(req.params.id)
                }, {
                    $set: {
                        Tags: rb.Tags,
                        Value: rb.Value
                    }
                },
                function(err, result) {
                    if (err) {
                        console.log(err);
                        return res.status(400).send(err);
                    }

                    console.log(result);
                    client.close();
                }
            );
        });
    } else {
        return res.status(400).send("Не указаны необходимые параметры");
    }
};

dataService.delete = function(req, res) {
    if (!req.params.id) {
        return res.status(400).send("Не указаны необходимые параметры");
    }

    connect(function(client, collection) {
        collection.updateOne({
                _id: new objectId(req.params.id)
            }, {
                $set: {
                    IsActive: false
                }
            },
            function(err, result) {
                if (err) {
                    console.log(err);
                    return res.status(400).send(err);
                }

                client.close();
                return res.status(200).send();
            }
        );
    });
};

function connect(callback) {
    console.log("connect");
    mongoClient.connect("mongodb://hXSmmJHt9NxG5nHA:LNyYvKZaVt7kDDS4@192.168.0.104:27017/", function(err, client) {
        if (err) {
            return console.log(err);
        }
        const db = client.db("diary");
        const collection = db.collection("data");
        callback(client, collection);
    });
}

module.exports = { 'DataService': dataService };
var express = require('express'),
    app = express(),
    port = 3000,
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(port, function() {
    console.log('Server listening: ' + port);
});

var entries = [{
    Id: 1,
    Tags: 'Password, Mongo, Diary',
    Value: 'superPassword1'
}, {
    Id: 2,
    Tags: 'Password, User, Administrator',
    Value: 'superPassword2'
}, {
    Id: 3,
    Tags: 'Guide, Mongo, installation',
    Value: 'Download and install MongoDB in docker =)))'
}, ];

app.get("/", function(req, res) {
    var f = '';
    var result = entries;
    if (req && req.query && req.query.filter) {
        f = req.query.filter.toLowerCase();
        result = entries.filter(function(entry) {
            return entry.Tags.toLowerCase().indexOf(f) >= 0;
        });
    }

    res.json(result);
});
app.post("/Entry", function(req, res) {
    if (req && req.body && req.params) {
        var max = Math.max.apply(null, entries.map(function(e) {
            return e.Id;
        })) + 1;
        if (!rb.Value) {
            res.status(400).send("Не указано значение");
        }
        if (!rb.Tags) {
            res.status(400).send("Не указаны тэги");
        }
        entries.push({
            Id: max,
            Tags: rb.Tags,
            Value: rb.Value
        });
    } else {
        return res.status(400).send("Не указаны необходимые параметры");
    }
});
app.post("/Entry/:id", function(req, res) {
    if (req && req.body && req.params) {
        var rb = req.body;
        var entry = entries.find(function(e) {
            return e.Id == req.params.id;
        });
        if (entry) {
            if (rb.Value) {
                entry.Value = rb.Value;
            }
            if (rb.Tags) {
                entry.Tags = rb.Tags;
            }
        } else {
            res.status(400).send("Запись не найдена");
        }

        res.sendStatus(200);
    } else {
        return res.status(400).send("Не указаны необходимые параметры");
    }
});
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
    Value: 'superPassword1',
    IsActive: true
}, {
    Id: 2,
    Tags: 'Password, User, Administrator',
    Value: 'superPassword2',
    IsActive: true
}, {
    Id: 3,
    Tags: 'Guide, Mongo, installation',
    Value: 'Download and install MongoDB in docker =)))',
    IsActive: true
}, {
    Id: 4,
    Tags: 'User, Mongo, Test, ivan.ivanov@ingos.ru',
    Value: 'Zxcvbnm,./',
    IsActive: true
}];

app.get("/", (req, res) => {
    res.sendFile("./index.html", { root: '.' });
});

app.get("/List", function(req, res) {
    var result = entries.filter(e => e.IsActive);
    if (req && req.query && req.query.filter)
        result = result.filter(e => e.Tags.toLowerCase().indexOf(req.query.filter.toLowerCase()) >= 0);
    res.json(result);
});

app.put("/New", function(req, res) {
    if (req && req.body && req.params) {
        var rb = req.body;
        var max = Math.max.apply(null, entries.map(function(e) {
            return e.Id;
        })) + 1;
        if (!rb.Value) {
            return res.status(400).send("Не указано значение");
        }
        if (!rb.Tags) {
            return res.status(400).send("Не указаны тэги");
        }

        entries.push({
            Id: max,
            Tags: rb.Tags,
            Value: rb.Value,
            IsActive: true
        });

        return res.status(200).send();
    } else {
        return res.status(400).send("Не указаны необходимые параметры");
    }
});

app.post("/Edit/:id", function(req, res) {
    if (req && req.body && req.params) {
        var rb = req.body;
        if (!rb.Value) {
            return res.status(400).send("Не указано значение");
        }
        if (!rb.Tags) {
            return res.status(400).send("Не указаны тэги");
        }
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
            return res.status(400).send("Запись не найдена");
        }

        res.sendStatus(200);
    } else {
        return res.status(400).send("Не указаны необходимые параметры");
    }
});

app.delete("/Delete/:id", function(req, res) {
    console.log(req.params);
    var i = entries.map(e => e.Id).indexOf(+req.params.id);
    if (~i) {
        entries[i].IsActive = false;
        return res.sendStatus(200);
    } else {
        return res.status(400).send("Запись не найдена");
    }
});
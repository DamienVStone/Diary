var express = require('express');
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
var dataService = require('./services/dataService').DataService;
var authService = require('./services/authService').AuthService;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var config = require('./config/main');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(morgan("dev"));
mongoose.connect(config.database);
require('./config/passport')(passport);
var apiRoutes = express.Router();
var basicRoutes = express.Router();

basicRoutes.get("/", dataService.home);
basicRoutes.get("/signin", dataService.signin);
basicRoutes.get("/List", authService.authorized, dataService.list);
basicRoutes.put("/New", authService.authorized, dataService.new);
basicRoutes.post("/Edit/:id", authService.authorized, dataService.edit);
basicRoutes.delete("/Delete/:id", authService.authorized, dataService.delete);

apiRoutes.post("/register", authService.register);
apiRoutes.post("/authenticate", authService.authenticate);
apiRoutes.get('/dashboard', authService.authorized, function(req, res) {
    res.send('It worked! User id is: ' + req.user._id + '.');
});

app.use('/api', apiRoutes);
app.use('/', basicRoutes);
mongoose.connect(config.database);

app.listen(port, function() {
    console.log('Server listening: ' + port);
});
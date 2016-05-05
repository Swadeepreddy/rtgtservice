var restify = require('restify');
var mongojs = require('mongojs');
const url = 'mongodb://localhost:27017/testdb';
var db = mongojs('testdb', ['userlocations']);

var portNum = 3000;

var server = restify.createServer();
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.listen(portNum, function () {
    console.log("Server started @ 3000");
});

// Find all user info
server.get("/getuserlocations", function (req, res, next) {
    db.userlocations.find(function (err, userlocations) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(userlocations));
    });
    return next();
});

// Find one user info by userid
server.get('/getuserlocations/:userId', function (req, res, next) {
    db.userlocations.findOne({
        userId: req.params.userId
    }, function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(data));
    });
    return next();
});

// save a user location info
server.post('/transmitLocation', function (req, res, next) {
    var location = req.params;
    db.userlocations.save(location,
        function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(data));
        });
    return next();
});

// add a user location info to his location collection
server.put('/transmitLocation/:userId', function (req, res, next) {
    // get the existing product
    db.userlocations.findOne({
        userId: req.params.userId
    }, function (err, data) {
        // merge req.params/product with the server/product
 
        var updloc = {}; // updated location
        
        for (var n in data) {
            updloc[n] = data[n];
        }
        for (var n in req.params) {
            updloc[n] = req.params[n];
        }
        db.userlocations.update({
            userId: req.params.userId
        }, updloc, {
            multi: false
        }, function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(data));
        });
    });
    return next();
});
var express = require('express');
var bodyParser = require('body-parser');
var Pusher = require('pusher');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var pusher = new Pusher({ // connect to pusher
  appId: process.env.PUSHER_APP_ID, 
  key: process.env.PUSHER_APP_KEY, 
  secret:  process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER, 
});

app.get('/api', function(req, res){ // for testing if the server is running
  res.send('all is well...');
});

// for authenticating users
app.get("/api/pusher/auth", function(req, res) {
  var query = req.query;
  var socketId = query.socket_id;
  var channel = query.channel_name;
  var callback = query.callback;

  var auth = JSON.stringify(pusher.authenticate(socketId, channel));
  var cb = callback.replace(/\"/g,"") + "(" + auth + ");";

  res.set({
    "Content-Type": "application/javascript"
  });

  res.send(cb);
});

app.post('/api/pusher/auth', function(req, res) {
  var socketId = req.body.socket_id;
  var channel = req.body.channel_name;
  var auth = pusher.authenticate(socketId, channel);
  res.send(auth);
});

module.exports = app;
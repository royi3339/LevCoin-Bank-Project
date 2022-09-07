require('dotenv').config()
const express = require("express")
var app = express();
// const path = require('path')
const bodyparser = require('body-parser')
const errorHandler = require('./utils/error-handler')
var cookieParser = require('cookie-parser')
var {secret} = require('./config/jwt-config.json')
var mongoose = require('mongoose')
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var routerApi = require('./routers/api.router')
var routerUser = require('./routers/user.router')
var routerAdmin = require('./routers/admin.router')
var routerMessage = require('./routers/message.router')
const http = require('http')

const cors = require('cors')
// app.use(cors());
// app.options('*', cors());
app.use(cors({credentials: true,  origin: ['http://localhost:3000','https://www.google.com/']}));



app.use(require('express-session')({ secret: secret, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
app.use(cookieParser())

app.use('/', routerApi)
app.use('/user', routerUser);
app.use('/admin', routerAdmin);
app.use('/message', routerMessage);

app.use(errorHandler);

//mongoose
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log('Connected to MongoDB')
})

/// passport config
var User = require('./models/user.model');

passport.use('local', new LocalStrategy({},
  function(username, password, done) {
    User.findOne({ username: username, password: password }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user);
    });
  }
));

var tempUserId = '';
passport.serializeUser(function(user, done) {

  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  // console.log("km = ", id);

  User.findById(id, function (err, user) {
    done(err, user);
  });
});


// app.listen(process.env.PORT || 2400, () => {
//   console.log("Server started: 2400")
// })

var server = http.createServer(app)

// This creates our socket using the instance of the server
var io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST","DELETE","PATCH"]
  }
});


// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {

  if (tempUserId != '')
  {
    socket.join(tempUserId);
    console.log("socket.rooms = ", socket.rooms); // socket.rooms =  Set(2) { 'ospl__XRqcwsdPJKAAAB', 'room 237' }
    console.log("socket.id = ", socket.id);
    tempUserId = ''

  }

  socket.on('success', (message) => {
    message.date = new Date().toString();
    io.sockets.emit('success', message)
  })
  socket.on('error', (message) => {
    message.date = new Date().toString();
    io.sockets.emit('error', message)
  })
})

server.listen( 2400, () => {
  console.log("Server started: 2400")
})


exports.getIo = function() {
  return io;
}


// module.exports = { io };

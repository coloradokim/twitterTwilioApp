require('dotenv').load();

var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var hashtag = db.get('hashtag');
var users = db.get('users');
var bcrypt = require('bcryptjs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tweet and Twilio' });
});


// Login Route
router.post('/login', function (req, res) {
  users.findOne({email: req.body.email}, function (err, doc){
    if (err) throw err
    else if (doc) {
      if (bcrypt.compareSync(req.body.password, doc.password)) {
        req.session.email = req.body.email
        res.redirect('users/form')
      }
    } else {
      res.render('index', {error: 'TRY AGAIN. Username or password are incorrect'})
    }
  })
});

// Logout Route
router.get('/logout', function (req, res) {
  req.session= null
  res.redirect('/')
});

// Register Route
router.get('/register', function(req, res) {
  res.render('register', {})
});

router.post('/register', function (req, res, next) {
  var errors = []
  if (!req.body.email) {
    errors.push("Email cannot be blank ")
  }
  if (!req.body.password) {
    errors.push(" password cannot be blank")
  }
  if (errors.length) {
    res.render('index', {errors: errors})
  } else {
      users.find({email:req.body.email}, function (err, doc) {
        if (doc.length === 0) {
          req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
          users.insert(req.body, function (err, doc) {
            if (err) return error
            req.session.id = doc._id
            res.redirect('users/form')
        })
      } else {
        error.push('Login invalid')
        res.render('register', {errors: errors})
      }
    })
  }
})


//Route to the search form
router.get('/search', function(req, res, next) {
  res.render('search', {});
});

//Collect data from the search form and insert into the database
router.post('/search', function (req, res, next) {
  console.log(req.params.hashtag);
  hashtag.insert(req.body, function (err, doc) {
    if (err) return error
    res.redirect('/users')
  })
});


module.exports = router;

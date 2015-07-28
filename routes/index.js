var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var hashtag = db.get('hashtag');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Route to the input form
router.get('/form', function(req, res, next) {
  res.render('form', {});
});

//Collect data from input form
router.post('/users', function (req, res, next) {
  hashtag.insert(req.body)
  console.log(req.body.hashtag)
    res.redirect('/users')
});

module.exports = router;

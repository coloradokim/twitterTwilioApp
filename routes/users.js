require('dotenv').load();

var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
var db = require('monk')(process.env.MONGOLAB_URI);
var hashtag = db.get('hashtag');


var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

/* GET users listing. */
/* GET users listing. */
router.get('/', function(req, res, next) {
  var params = {q: 'daftpunk'};
  client.get('search/tweets', params, function(error, tweets, response){
     if (!error) {
       res.render('users', {tweets: tweets.statuses});
     }
   })
 });


module.exports = router;

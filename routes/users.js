require('dotenv').load();

var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
var db = require('monk')(process.env.MONGOLAB_URI);
var hashtag = db.get('hashtag');
var emergencyTweet = db.get('emergencyTweet');
var twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

router.get('/hashtags', function (req, res, next) {
  hashtag.find({}, function (err, docs) {
    res.render('hashtags', { hashtag: docs })
  })
});

 // This route accesses the twitter search API
router.get('/send', function (req, res, next) {
  var params = {q: req.query.hashtag};
  client.get('search/tweets', params, function (error, tweets, response) {
    if (!error) {
      res.render('send', {tweets: tweets.statuses});
    }
  })
});

router.get('/preview', function (req, res, next) {
  emergencyTweet.findOne(req.body, function (err, doc) {
    if (err) throw err
    res.render('preview', {emergencyTweet: doc})
  })
});


//   twilioClient.sendMessage({
//     to: req.body.phoneNumber,
//     from: '+14847722321', // A number you bought from Twilio and can use for outbound communication
//     body: req.body.message
// }, function(err, responseData) { //this function is executed when a response is received from Twilio
//     if (!err) {
//         console.log(responseData.from); // outputs "sendMessage.from
//         console.log(responseData.body); // outputs sendMessage.body
//     }
//   })

module.exports = router;

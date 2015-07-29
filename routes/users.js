require('dotenv').load();

var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
var db = require('monk')(process.env.MONGOLAB_URI);
var hashtag = db.get('hashtag');
var twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

//Twilio API
//This will become a post request that looks like this: HTTP POST to Messages /2010-04-01/Accounts/{AccountSid}/Messages
// twilioClient.sendMessage({
//     to:'+17194294831', // Eventually, the phonenumber from the database
//     from: '+14847722321', // A number you bought from Twilio and can use for outbound communication
//     body: 'fifth time!' // text of tweet
// }, function(err, responseData) { //this function is executed when a response is received from Twilio
//     if (!err) { // "err" is an error received during the request, if any
//
//         // "responseData" is a JavaScript object containing data received from Twilio.
//         // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
//         // http://www.twilio.com/docs/api/rest/sending-sms#example-1
//
//         console.log(responseData.from); // outputs "sendMessage.from  "
//         console.log(responseData.body); // outputs sendMessage.body
//
//     }
// });
//
// router.get('/:id', function (req, res, next) {
//   hashtag.findOne({_id: req.params.hashtag}, function (err, doc) {
//     console.log(req.params.hashtag);
//     if (err) throw err
//     res.render('users/send', doc)
//   })
// });

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});


// This interacts with the twitter API
router.get('/send', function(req, res, next) {
  console.log(req.query.hashtag);
  var params = {q: req.query.hashtag};
  client.get('search/tweets', params, function(error, tweets, response){
     if (!error) {
       res.render('send', {tweets: tweets.statuses});
     }
   })
 });


 router.get('/hashtags', function(req, res, next) {
   hashtag.find({}, function (err, docs){
     res.render('hashtags', { hashtag: docs })
   })
 });


 /* GET confirmation page. */
 router.get('/confirmation', function(req, res, next) {
   res.render('confirmation');
 });




module.exports = router;

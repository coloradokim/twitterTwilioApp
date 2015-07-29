require('dotenv').load();

var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
var db = require('monk')(process.env.MONGOLAB_URI);
var hashtag = db.get('hashtag');
var twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

//Twilio API
//This will become a post request that looks like this: HTTP POST to Messages /2010-04-01/Accounts/{AccountSid}/Messages
twilioClient.sendMessage({
    to:'+17194294831', // Eventually, the phonenumber from the database
    from: '+14847722321', // A number you bought from Twilio and can use for outbound communication
    body: 'fifth time!' // text of tweet
}, function(err, responseData) { //this function is executed when a response is received from Twilio
    if (!err) { // "err" is an error received during the request, if any

        // "responseData" is a JavaScript object containing data received from Twilio.
        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

        console.log(responseData.from); // outputs "sendMessage.from  "
        console.log(responseData.body); // outputs sendMessage.body

    }
});


var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  var params = {q: 'dogs'};
  client.get('search/tweets', params, function(error, tweets, response){
     if (!error) {
       res.render('users', {tweets: tweets.statuses});
     }
   })
 });

 //Route to the input form
 router.get('/form', function(req, res, next) {
   res.render('form', {});
 });

 //Collect data from input form
 router.post('/users', function (req, res, next) {
   console.log(req.body);
   hashtag.insert(req.body)
     res.redirect('users')
 });



//test route -- delete soon (maybe this will fix itself when the database stuff is worked out. )
 router.get('/test', function (req, res, next) {
  hashtag.findOne({hashtag: req.body}, function (err, doc) {
    if (err) throw err
    res.render('test', doc)
  })
});




module.exports = router;

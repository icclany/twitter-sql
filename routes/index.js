'use strict';
var express = require('express');
var router = express.Router();
// var tweetBank = require('../tweetBank');
var tweetDB = require('../models');
var Tweet = tweetDB.Tweet;
var User = tweetDB.User;

module.exports = function makeRouterWithSockets (io) {

  // a reusable function
  function respondWithAllTweets (req, res, next){
    Tweet.findAll({include: [User]}).then(function(tweets) { 
      res.render('index', {
        title: 'Welcome to Twitter!',
        tweets: tweets,
        showForm: true
      });
    });
  }

  // here we basically treet the root view and tweets view as identical
  router.get('/', respondWithAllTweets);
  router.get('/tweets', respondWithAllTweets);

  // single-user page
  router.get('/users/:username', function(req, res, next){
    Tweet.findAll({include: [{model: User, where: {name: req.params.username}}]}).then(function(tweets) { 
      res.render('index', {
        title: 'User Page',
        tweets: tweets,
        showForm: true
      });
    });
  });

  // single-tweet page
  router.get('/tweets/:id', function(req, res, next){
    Tweet.findAll({include: [User], where: {id: req.params.id}}).then(function (tweets) {
      res.render('index', {
        title: 'Tweet Page',
        tweets: tweets,
        showForm: true
      });
    });
  });

  // create a new tweet
  router.post('/tweets', function(req, res, next){
    var usr = {};
    User.findOrCreate({include: [Tweet], where: {name: req.body.name}, defaults: {pictureUrl: 'http://www.adweek.com/socialtimes/files/2012/03/twitter-egg-icon.jpg'}})
    .spread(function(userperson) {
      usr = userperson;
      console.log(usr);
      return Tweet.create({UserId: userperson.id, content: req.body.text});
    }).then(function(newTweet) {
      io.sockets.emit('new_tweet', {
        User: usr,
        id: newTweet.id,
        content: newTweet.content
      });
      res.redirect('/');
    });
  });

  // // // replaced this hard-coded route with general static routing in app.js
  // // router.get('/stylesheets/style.css', function(req, res, next){
  // //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
  // // });

  return router;
};

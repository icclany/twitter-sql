// pull in the Sequelize library
var Sequelize = require('sequelize');

// create an instance of a database connection
// which abstractly represents our app's sqlite database
var twitterjsDB = new Sequelize('twitterjs', 'root', null, {
  dialect: 'sqlite',
  storage: '../databases/twitterjs.db',
  logging: false
});

// open the connection to our database
twitterjsDB
.authenticate()
.then(function () {
  console.log('Connection has been established successfully.');
})
.catch(function (err) {
  console.error('Problem connecting to the database:', err);
});

var Tweet = require('./tweet')(twitterjsDB);
var User = require('./user')(twitterjsDB);

// adds a UserId foreign key to the `Tweets` table
User.hasMany(Tweet);
Tweet.belongsTo(User);

module.exports = {
  User: User,
  Tweet: Tweet
};

// User.findOne( {where: { name: 'Taylor Swift'}}).then(function (user) {
//   return user.getTweets();
// })
// .then(function (tweets) {
//   JSON.stringify(tweets); // another way of just logging the plain old values
//   console.log(tweets);
// });
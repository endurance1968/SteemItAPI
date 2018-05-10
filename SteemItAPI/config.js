var config = {};

config.steem = {};
config.mongo = {};

//global configuration
config.steem.username = process.env.STEEM_USER || 'endurance1968';
config.steem.password = process.env.STEEM_PASSWORD || 'ENTER_PASSWORD_HERE'; // Masterpwd!

config.mongo.url = "mongodb://mongo.research.ok-edv.de:27017/";

//finally
module.exports = config;
var config = {};

config.steem = {};

//global configuration
config.steem.username = process.env.STEEM_USER || 'endurance1968';
config.steem.password = process.env.STEEM_PASSWORD || 'ENTER_PASSWORD_HERE'; // Masterpwd!

//finally
module.exports = config;
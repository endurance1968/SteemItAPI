var config = {};

config.steem = {};
config.mongo = {};

//global configuration
config.steem.username = process.env.STEEM_USER || 'endurance1968';
config.steem.password = process.env.STEEM_PASSWORD || 'ENTER_PASSWORD_HERE'; // Masterpwd!
config.steem.accounthistmaxretr = 2000;

config.mongo.url = "mongodb://mongo.research.ok-edv.de:27017/";
config.mongo.dbname = "crypt_matrix";
config.mongo.steem_trx_collection_prefix = "steem_ptrx_";
config.mongo.steem_account_collection = "account_stats";

//finally
module.exports = config;
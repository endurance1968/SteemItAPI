var config = {};

config.steem = {};
config.mongo = {};

//global configuration
config.steem.username = process.env.STEEM_USER || 'endurance1968';
config.steem.password = process.env.STEEM_PASSWORD || 'ENTER_PASSWORD_HERE'; // Masterpwd!
// maximum allowed is 10000 but 1000 seems to be more reliable 
config.steem.accounthistmaxretr = 1000;

config.mongo.url = "mongodb://mongo.research.ok-edv.de:27017/";
config.mongo.dbname = "crypt_matrix";
config.mongo.steem_ptrx_collection_prefix = "steem_ptrx_";
config.mongo.steem_account_collection = "steem_account_stats";
config.mongo.steam_ptrx_collections = [
    'author_reward',
    'curation_reward',
    'transfer',
    'claim_reward_balance',
    'transfer_to_savings',
    'transfer_to_vesting',
    'comment_benefactor_reward',
    'transfer_from_savings',
    'fill_transfer_from_savings',
    'fill_vesting_withdraw',
    'feed_publish',
    'producer_reward',
    'shutdown_witness',
    'witness_update',
    'withdraw_vesting',
    'convert',
    'fill_convert_request',
    'interest',
    'account_create',
    'fill_order',
    'pow'
]
config.mongo.steem_otrx_collection = [
    'vote',
    'custom_json',
    'comment',
    'account_update',
    'account_create_with_delegation',
    'comment_options',
    'delegate_vesting_shares',
    'account_witness_vote',
    'limit_order_create',
    'limit_order_cancel',
    'delete_comment',
    'return_vesting_delegation',
    'account_witness_proxy',
    'request_account_recovery',
    'recover_account',
    'set_withdraw_vesting_route',
    'cancel_transfer_from_savings'
]

//finally
module.exports = config;
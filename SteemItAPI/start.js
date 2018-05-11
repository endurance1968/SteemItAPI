'use strict';

var mongoclient = require('mongodb').MongoClient;

// import my steem modules
var steemapi = require('./api/steemapi');
var mongoapi = require('./api/mongoapi');
var config = require('./config');

var dbo;

// just for testing purposes you should see a Hello World on your console prio to any further activity
console.log('Starting my activities');
init();

function evalAccountHistoryPayments(accountname, transaction, trxindex){
    //console.log("   transaction-block: " + transaction.block);
    let operation = transaction.op;
    //console.log("   transaction-id: " + transaction.trx_id + " timestamp: " + transaction.timestamp+" operationtype: " + operation[0]);
    // adding the account history index for each transaction
    transaction.account_hist_idx = trxindex;
    transaction.account_hist_name = accountname;

    if (operation[0] == 'author_reward') {
        let arewardoperation = operation[1];
        //console.log("       operation-sbdpayout: " + arewardoperation.sbd_payout);
        //console.log("       operation-steempayout: " + arewardoperation.steem_payout);
        mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
    } else if (operation[0] == 'curation_reward') {
        let arwardoperation = operation[1];
        //console.log("       operation-reward: " + arwardoperation.reward);
        //console.log("       operation-curator: " + arwardoperation.curator);
        mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
    } else if (operation[0] == 'transfer') {
        let transferoperation = operation[1];
        //console.log("       operation-from: " + transferoperation.from);
        //console.log("       operation-to: " + transferoperation.to);
        //console.log("       operation-amount: " + transferoperation.amount);
        mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
    } else if (operation[0] == 'claim_reward_balance') {
        let claimoperation = operation[1];
        //console.log("       operation-account: " + claimoperation.account);
        //console.log("       operation-reward_steem: " + claimoperation.reward_steem);
        //console.log("       operation-reward_sbd: " + claimoperation.reward_sbd);
        mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
    } else if (operation[0] == 'transfer_to_savings') {
        let transferoperation = operation[1];
        //console.log("       operation-amount: " + transferoperation.amount);
        //console.log("       operation-from: " + transferoperation.from);
        //console.log("       operation-to: " + transferoperation.to);
        mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
    } else if (operation[0] == 'transfer_to_vesting') {
        let transferoperation = operation[1];
        //console.log("       operation-amount: " + transferoperation.amount);
        //console.log("       operation-from: " + transferoperation.from);
        //console.log("       operation-to: " + transferoperation.to);
        mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
    } else if (operation[0] == 'comment_benefactor_reward') {
        let commentbeneoperation = operation[1];
        //console.log("       operation-reward: " + commentbeneoperation.reward);
        mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
    } else if (operation[0] == 'transfer_from_savings') {
        let tfsoperation = operation[1];
        //console.log("       operation-amount: " + tfsoperation.amount);
        //console.log("       operation-from: " + tfsoperation.from);
        //console.log("       operation-to: " + tfsoperation.to);
        mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
    } else if (operation[0] == 'fill_transfer_from_savings') {
        let tfsoperation = operation[1];
        //console.log("       operation-amount: " + tfsoperation.amount);
        //console.log("       operation-from: " + tfsoperation.from);
        //console.log("       operation-to: " + tfsoperation.to);
        mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
    } else if (operation[0] == 'fill_vesting_withdraw') {
        let tfsoperation = operation[1];
        //console.log("       operation-withdrawn: " + tfsoperation.withdrawn);
        //console.log("       operation-deposited: " + tfsoperation.deposited);
        //console.log("       operation-from_account: " + tfsoperation.from_account);
        //console.log("       operation-to.account: " + tfsoperation.to_account);
        mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
    } else if (operation[0] == 'feed_publish') {
        let tfsoperation = operation[1];
        mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
    } else if (operation[0] == 'producer_reward') {
        let tfsoperation = operation[1];
        mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
    } else if (operation[0] == 'shutdown_witness') {
        let tfsoperation = operation[1];
        mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
    } else if (operation[0] == 'witness_update') {
        let tfsoperation = operation[1];
        mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
    } else if (operation[0] == 'withdraw_vesting') {
        let tfsoperation = operation[1];
        //console.log("       operation-account: " + tfsoperation.account);
        //console.log("       operation-vesting_shares: " + tfsoperation.proxy);
        mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
    } else if (operation[0] == 'convert') {
        let tfsoperation = operation[1];
        //console.log("       operation-amount: " + tfsoperation.amount);
        //console.log("       operation-owner: " + tfsoperation.owner);
        mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
    } else if (operation[0] == 'fill_convert_request') {
        let tfsoperation = operation[1];
        //console.log("       operation-amount_in: " + tfsoperation.amount_in);
        //console.log("       operation-amount_in: " + tfsoperation.amount_out);
        //console.log("       operation-owner: " + tfsoperation.owner);
        mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
    } else if (operation[0] == 'interest') {
        let tfsoperation = operation[1];
        //console.log("       operation-interest: " + tfsoperation.interest);
        //console.log("       operation-owner: " + tfsoperation.owner);
        mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
    } else if (operation[0] == 'request_account_recovery') {
        let tfsoperation = operation[1];
        //mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
    } else if (operation[0] == 'account_create') {
        let tfsoperation = operation[1];
        mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
    } else if (operation[0] == 'pow') {
        let tfsoperation = operation[1];
        mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
    } else {
        //console.log("No payment relevant transaction");
        return false;
    }

    // update account retrieval status
    //console.log(trxindex);
    mongoapi.updateOne(dbo, config.mongo.steem_account_collection, { account: accountname }, { $set: { low_ptrx: trxindex } },updateOneCB)
    return true;
}

function updateOneCB(err, result) {

}

//
// retrieve account history
//
function getAccountHistoryCB(accountname, from, high, err, result = []) {
    if (err == null) {
        // we should get an array with data of accounts
        if (result.length > 0) {
            let newfrom = result[result.length - 1][0];
            if (high === -1) {
                mongoapi.updateOne(dbo, config.mongo.steem_account_collection, { account: accountname }, { $set: { high_ptrx: newfrom } }, updateOneCB)
                high = newfrom;
            }
            newfrom = newfrom - (config.steem.accounthistmaxretr + 1);
            if (newfrom > config.steem.accounthistmaxretr) {
                console.log("getAccountHistory from index " + (newfrom + config.steem.accounthistmaxretr + 1) + " for " + accountname);
                steemapi.getAccountHistory(accountname, newfrom, config.steem.accounthistmaxretr, high, getAccountHistoryCB);
            }
            else {
                if (newfrom > 0) {
                    console.log("getAccountHistory get the last " + newfrom + " history entries for " + accountname);
                    steemapi.getAccountHistory(accountname, newfrom, newfrom, high, getAccountHistoryCB);
                }
                else
                    console.log("getAccountHistory for " + accountname + " done");
            }
        }
        else
            console.log("no data retrieved for account: " + account);

        for (let i = (result.length-1); i >=0 ; i--) {
            //console.log(result);
            //console.log("history-ID: " + result[i][0]);
            let transaction = result[i][1];

            var handled = evalAccountHistoryPayments(accountname, transaction,result[i][0]);
            if (handled == false) {
                //console.log("   transaction-block: " + transaction.block);
                let operation = transaction.op;
                //console.log("   transaction-id: " + transaction.trx_id + " timestamp: " + transaction.timestamp+" operationtype: " + operation[0]);
                if (operation[0] == 'vote') {
                    let voteoperation = operation[1];
                    //console.log("       operation-voter: " + voteoperation.voter);
                    //console.log("       operation-author: " + voteoperation.author);
                } else if (operation[0] == 'custom_json') {
                    let customoperation = operation[1];
                    //console.log("       operation-id: " + customoperation.id);
                    //console.log("       operation-json: " + customoperation.json);
                } else if (operation[0] == 'comment') {
                    let commentoperation = operation[1];
                    //console.log("       operation-author: " + commentoperation.author);
                } else if (operation[0] == 'account_update') {
                    let accountoperation = operation[1];
                } else if (operation[0] == 'account_create_with_delegation') {
                    let accountcreateroperation = operation[1];
                } else if (operation[0] == 'comment_options') {
                    let commentoptionoperation = operation[1];
                } else if (operation[0] == 'delegate_vesting_shares') {
                    let delegatevestingroperation = operation[1];
                    //console.log("       operation-delegator: " + delegatevestingroperation.delegator);
                    //console.log("       operation-delegatee: " + delegatevestingroperation.delegatee);
                    //console.log("       operation-vesting_shares: " + delegatevestingroperation.vesting_shares);
                    //mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
                } else if (operation[0] == 'account_witness_vote') {
                    let accountcreateroperation = operation[1];
                    //console.log("       operation-account: " + accountcreateroperation.account);
                    //console.log("       operation-witness: " + accountcreateroperation.witness);
                } else if (operation[0] == 'fill_order') {
                    let fillorderoperation = operation[1];
                    //console.log("       operation-owner: " + fillorderoperation.current_owner);
                    //console.log("       operation-pays: " + fillorderoperation.current_pays);
                    //mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
                } else if (operation[0] == 'limit_order_create') {
                    let ordercreateoperation = operation[1];
                    //console.log("       operation-amount: " + ordercreateoperation.amount_to_sell);
                    //mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
                } else if (operation[0] == 'limit_order_cancel') {
                    let tfsoperation = operation[1];
                    //console.log("       operation-owner: " + tfsoperation.owner);
                    //console.log("       operation-orderid: " + tfsoperation.orderid);
                } else if (operation[0] == 'delete_comment') {
                    let tfsoperation = operation[1];
                    //console.log("       operation-author: " + tfsoperation.author);
                    //console.log("       operation-permlink: " + tfsoperation.permlink);
                } else if (operation[0] == 'return_vesting_delegation') {
                    let tfsoperation = operation[1];
                    //console.log("       operation-account: " + tfsoperation.account);
                    //console.log("       operation-vesting_shares: " + tfsoperation.vesting_shares);
                } else if (operation[0] == 'account_witness_proxy') {
                    let tfsoperation = operation[1];
                    //console.log("       operation-account: " + tfsoperation.account);
                    //console.log("       operation-proxy: " + tfsoperation.proxy);
                    //mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
                } else if (operation[0] == 'request_account_recovery') {
                    let tfsoperation = operation[1];
                    //mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
                } else if (operation[0] == 'recover_account') {
                    let tfsoperation = operation[1];
                    //mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
                } else if (operation[0] == 'set_withdraw_vesting_route') {
                    let tfsoperation = operation[1];
                    //mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
                } else if (operation[0] == 'cancel_transfer_from_savings') {
                    let tfsoperation = operation[1];
                    //mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
                } else {
                    console.log(operation[1]);
                }
            }
        }
    } else {
        //err!=null
        console.log("getAccountHistory for account :" +accountname+" failed "+err);
    }
}

function getFloatValue(pValue, pFactor) {
    if (pValue === undefined || pValue === null || pValue === '') return null;
    var separator = pValue.indexOf(' ');
    if (separator > 0) {
        return parseFloat(pValue.substring(0, separator)) * (pFactor !== undefined && pFactor !== null ? pFactor : 1.0);
    }
    return null;
}

function find_claim_reward_balanceCB(err, result = []) {
    if (err == null) {
        let steem=0;
        let sbd=0;
        let vests = 0;

        for (let i = 0; i < result.length; i++) {
            let transaction = result[i];
            let operation = transaction.op;
            let claimoperation = operation[1];

            sbd += getFloatValue(claimoperation.reward_sbd);
            steem += getFloatValue(claimoperation.reward_steem);
            vests += getFloatValue(claimoperation.reward_vests);
        }

        console.log("Sum of "+result.length+" reward entries - steem: " + steem+" sbd: "+sbd+" vests: "+vests);

    } else {
        console.log("find_claim_reward_balanceCB failed");
    }
}

function createAccountDocCB(err, result,customdata) {
    // If there is a result we have already an account document ->SKIP
    if (result.length <= 0) { 
        // next step is create documents
        // mongodb stores data as bson documents which is a binary representation of json http://bsonspec.org/
        // 
        let  accountdoc = {
            account: customdata,
            low_ptrx: -1,
            high_ptrx: -1
        };
        // insert a document/object which is similar to create a record in a classic SQL DB
        mongoapi.insertObject(dbo, config.mongo.steem_account_collection, accountdoc);
        steemapi.getAccountHistory(customdata, -1, config.steem.accounthistmaxretr, -1 , getAccountHistoryCB);
    }
    if (result.length === 1) {
        // one result 
        let from = result[0].low_ptrx;
        let high = result[0].high_ptrx;
        if (from >= config.steem.accounthistmaxretr)
            steemapi.getAccountHistory(customdata, from, config.steem.accounthistmaxretr, high, getAccountHistoryCB);
        else
            steemapi.getAccountHistory(customdata, from, from, high, getAccountHistoryCB);
    }
}

// requests details of an array of accounts
// since the fucntions are asynchronous you need to work with callbacks to get the data
function getAccountsCB(err, result = []) {
    if (err == null) {
        // we should get an array with data of accounts
        for (let i = 0; i < result.length; i++) {
            /*
              { id: 586156,
              name: 'endurance1968',
              owner:
               { weight_threshold: 1,
                 account_auths: [],
                 key_auths: [ [Array] ] },
              active:
               { weight_threshold: 1,
                 account_auths: [],
                 key_auths: [ [Array] ] },
              posting:
               { weight_threshold: 1,
                 account_auths: [ [Array] ],
                 key_auths: [ [Array] ] },
              memo_key: 'STM5ZQ2HHE7KZy9yotctFt6CECbFsUXVsyuy7KFNJiDfHURMy721x',
              json_metadata: '{"profile":{"name":"Endurance","about":"IoT, renewable energy, smarthome","location":"Germany","website":"https://okedv.dyndns.org/wbb/wcf/","profile_image":"https://okedv.dyndns.org/endurance.png","cover_image":"https://okedv.dyndns.org/steembackground.png"}}',
              proxy: '',
              last_owner_update: '2018-02-17T07:54:06',
              last_account_update: '2018-05-05T04:21:15',
              created: '2018-01-08T21:24:00',
              mined: false,
              recovery_account: 'steem',
              last_account_recovery: '1970-01-01T00:00:00',
              reset_account: 'null',
              comment_count: 0,
              lifetime_vote_count: 0,
              post_count: 492,
              can_vote: true,
              voting_power: 6654,
              last_vote_time: '2018-05-06T05:32:27',
              balance: '0.028 STEEM',
              savings_balance: '0.000 STEEM',
              sbd_balance: '0.136 SBD',
              sbd_seconds: '381077865',
              sbd_seconds_last_update: '2018-05-05T17:41:54',
              sbd_last_interest_payment: '2018-04-30T20:14:21',
              savings_sbd_balance: '1.476 SBD',
              savings_sbd_seconds: '0',
              savings_sbd_seconds_last_update: '2018-05-04T20:33:54',
              savings_sbd_last_interest_payment: '1970-01-01T00:00:00',
              savings_withdraw_requests: 0,
              reward_sbd_balance: '0.000 SBD',
              reward_steem_balance: '0.000 STEEM',
              reward_vesting_balance: '0.000000 VESTS',
              reward_vesting_steem: '0.000 STEEM',
              vesting_shares: '33069.663388 VESTS',
              delegated_vesting_shares: '0.000000 VESTS',
              received_vesting_shares: '0.000000 VESTS',
              vesting_withdraw_rate: '0.000000 VESTS',
              next_vesting_withdrawal: '1969-12-31T23:59:59',
              withdrawn: 0,
              to_withdraw: 0,
              withdraw_routes: 0,
              curation_rewards: 141,
              posting_rewards: 8593,
              proxied_vsf_votes: [ 0, 0, 0, 0 ],
              witnesses_voted_for: 1,
              last_post: '2018-05-06T05:35:24',
              last_root_post: '2018-05-06T05:20:36',
              average_bandwidth: '90892730970',
              lifetime_bandwidth: '834561000000',
              last_bandwidth_update: '2018-05-06T05:35:24',
              average_market_bandwidth: 2497090717,
              lifetime_market_bandwidth: '25590000000',
              last_market_bandwidth_update: '2018-05-04T20:34:21',
              vesting_balance: '0.000 STEEM',
              reputation: '124347211954',
              transfer_history: [],
              market_history: [],
              post_history: [],
              vote_history: [],
              other_history: [],
              witness_votes: [ 'sempervideo' ],
              tags_usage: [],
              guest_bloggers: [] }
            */
            //console.log(result[i]);
            console.log("account-ID: " + result[i].id + " account-name:" + result[i].name + " number of posts:" + result[i].post_count);

            for (let j = 0; j < result[i].transfer_history.length; j++) {
                console.log(result[i].transfer_history[j]);
            }
        }

    } else { console.log("getAccount failed"); }
}


function createAccountCollectionIndexCB(err,indexName) {
    // now do some real action
    //steemapi.getAccounts([config.steem.username, 'endurance1968'], getAccountsCB);

    // some example account names to fill the 
    // transaction collections
    var accountnames = [
        "endurance1968",
        "taxguy",
        "sempervideo",
        "theaustrianguy",
        "lenatramper",
        "uwelang",
        "steemitblog"/*,
        "berniesanders",
        "adsactly",
        "haejin",
        "jedigeiss",
        "dtube",
        "steem"*/
    ];
    for (let i = 0; i < accountnames.length; i++) {
        mongoapi.find(dbo, config.mongo.steem_account_collection, { account: accountnames[i] }, { _id: 0 }, accountnames[i], createAccountDocCB)
    }
}


function runCB() {
    //
    // I used mongo 3.6 for testing installed on an Ubuntu server (don't forget to open the firewall for port 27017)
    // For checking I installed mongodb also on my windows development client
    // using the compass client
    // looks like without any content there will be no DB, I assume the explicit createDB call is not required 
    //
    mongoapi.createMongoDB(config.mongo.url, config.mongo.dbname);
    //
    // creates a collection within our db
    // Note: collections are similar to tables in a classic SQL db
    //
    //mongoapi.createCollection(dbo,"steemit_history");
    //mongoapi.createCollection(dbo, config.mongo.steem_account_collection);  
    mongoapi.createUniqueIndex(dbo, config.mongo.steem_account_collection, "account", createAccountCollectionIndexCB);


    //mongoapi.find(dbo, "steem_trx_claim_reward_balance", { timestamp: RegExp('2018-.*'), 'op.account': "endurance1968" }, { _id: 0 }, find_claim_reward_balanceCB);
    //mongoapi.find(dbo, "steem_trx_claim_reward_balance", { timestamp: RegExp('2018-.*'), 'op.account': "taxguy" }, { _id: 0 }, find_claim_reward_balanceCB);
    //mongoapi.find(dbo, "steem_trx_claim_reward_balance", { timestamp: RegExp('2018-.*'), 'op.account': "theaustrianguy" }, { _id: 0 }, find_claim_reward_balanceCB);
    //mongoapi.find(dbo, "steem_trx_claim_reward_balance", { timestamp: RegExp('2018-.*'), 'op.account': "uwelang" }, { _id: 0 }, find_claim_reward_balanceCB);
    //mongoapi.find(dbo, "steem_trx_claim_reward_balance", { timestamp: RegExp('2018-.*'), 'op.account': "haejin" }, { _id: 0 }, find_claim_reward_balanceCB);
    //mongoapi.find(dbo, "steem_trx_claim_reward_balance", { timestamp: RegExp('2018-.*'), 'op.account': "sempervideo" }, { _id: 0 }, find_claim_reward_balanceCB);
    console.log('Good bye all actions triggered');
}

function init() {
    // create the mongo connection once to avoid millions of
    // connections slowing down the performance
    mongoclient.connect(config.mongo.url, function (err, db) {
        if (err)
            throw err;
        dbo = db.db(config.mongo.dbname);
        runCB();
    });
}
'use strict';

// import common steem API
var steem = require('steem');

// import my steem modules
var steemapi = require('./steemapi');
var mongoapi = require('./mongoapi');
var config = require('./config');

// just for testing purposes you should see a Hello World on your console prio to any further activity
console.log('Starting my activities');

// now do some real action
// your user is used to upvote the article steemitapitest of user endurance1968
// creates a encoded hash to autorize yourself with posting role
/*
var wif = steem.auth.toWif(config.steem.username, config.steem.password, 'posting');
steemapi.vote(wif, config.steem.username, 'endurance1968', 'steemitapitest');
*/

// requests details of an array of accounts
// since the fucntions are asynchronous you need to work with callbacks to get the data
function getAccountsCB(err,result=[]) {
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
//steemapi.getAccounts([config.steem.username, 'endurance1968'], getAccountsCB);

//
// retrieve account history
//
function getAccountHistoryCB(err, result = []) {
    if (err == null) {
        // we should get an array with data of accounts
        for (let i = 0; i < result.length; i++) {
            //console.log(result);
            //console.log("history-ID: " + result[i][0]);
            var transaction = result[i][1];
            //console.log("   transaction-block: " + transaction.block);
            var operation = transaction.op;
            console.log("   transaction-id: " + transaction.trx_id + " timestamp: " + transaction.timestamp+" operationtype: " + operation[0]);
            if (operation[0] == 'vote') {
                let voteoperation = operation[1];
                //console.log("       operation-voter: " + voteoperation.voter);
                //console.log("       operation-author: " + voteoperation.author);
            } else if (operation[0] == 'author_reward') {
                let arewardoperation = operation[1];
                console.log("       operation-sbdpayout: " + arewardoperation.sbd_payout);
                console.log("       operation-steempayout: " + arewardoperation.steem_payout);
            } else if (operation[0] == 'curation_reward') {
                let arwardoperation = operation[1];
                console.log("       operation-reward: " + arwardoperation.reward);
                console.log("       operation-curator: " + arwardoperation.curator);
            } else if (operation[0] == 'custom_json') {
                let customoperation = operation[1];
                //console.log("       operation-id: " + customoperation.id);
            } else if (operation[0] == 'transfer') {
                let transferoperation = operation[1];
                console.log("       operation-from: " + transferoperation.from);
                console.log("       operation-to: " + transferoperation.to);
                console.log("       operation-amount: " + transferoperation.amount);
            } else if (operation[0] == 'comment') {
                let commentoperation = operation[1];
                //console.log("       operation-author: " + commentoperation.author);
            } else if (operation[0] == 'claim_reward_balance') {
                let claimoperation = operation[1];
                console.log("       operation-account: " + claimoperation.account);
                console.log("       operation-reward_steem: " + claimoperation.reward_steem);
                console.log("       operation-reward_sbd: " + claimoperation.reward_sbd);
            } else if (operation[0] == 'account_update') {
                let accountoperation = operation[1];
            } else if (operation[0] == 'transfer_to_savings') {
                let transferoperation = operation[1];
                console.log("       operation-amount: " + transferoperation.amount);
                console.log("       operation-from: " + transferoperation.from);
                console.log("       operation-to: " + transferoperation.to);
            } else if (operation[0] == 'transfer_to_vesting') {
                let transferoperation = operation[1];
                console.log("       operation-amount: " + transferoperation.amount);
                console.log("       operation-from: " + transferoperation.from);
                console.log("       operation-to: " + transferoperation.to);
            } else if (operation[0] == 'account_create_with_delegation') {
                let accountcreateroperation = operation[1];
            } else if (operation[0] == 'comment_options') {
                let commentoptionoperation = operation[1];
            } else if (operation[0] == 'delegate_vesting_shares') {
                let delegatevestingroperation = operation[1];
            } else if (operation[0] == 'account_witness_vote') {
                let accountcreateroperation = operation[1];
                console.log("       operation-account: " + accountcreateroperation.account);
                console.log("       operation-witness: " + accountcreateroperation.witness);
            } else if (operation[0] == 'fill_order') {
                let fillorderoperation = operation[1];
                console.log("       operation-owner: " + fillorderoperation.current_owner);
                console.log("       operation-pays: " + fillorderoperation.current_pays);
            } else if (operation[0] == 'limit_order_create') {
                let ordercreateoperation = operation[1];
                console.log("       operation-amount: " + ordercreateoperation.amount_to_sell);
            } else if (operation[0] == 'comment_benefactor_reward') {
                let commentbeneoperation = operation[1];
                console.log("       operation-reward: " + commentbeneoperation.reward);
            } else if (operation[0] == 'transfer_from_savings') {
                let tfsoperation = operation[1];
                console.log("       operation-amount: " + tfsoperation.amount);
                console.log("       operation-from: " + tfsoperation.from);
                console.log("       operation-to: " + tfsoperation.to);
            }
                

            else {
                console.log(operation[1]);
            }

        }
    } else { console.log("getAccountHistory failed"); }
}
steemapi.getAccountHistory(config.steem.username, -1, 10000, getAccountHistoryCB);

console.log('Good bye');
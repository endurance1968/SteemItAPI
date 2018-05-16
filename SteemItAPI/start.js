'use strict';

var mongoclient = require('mongodb').MongoClient;

// import my steem modules
var steemapi = require('./api/steemapi');
var mongoapi = require('./api/mongoapi');
var config = require('./config');

var fs = require('fs');

var dbo;
var test_account_names = [
    "steemitblog",
    "dtube",
    "haejin",
    "berniesanders",
    "steem",
    "endurance1968"/*,
    "taxguy",
    "sempervideo",
    "jedigeiss",
    "theaustrianguy",
    "adsactly",
    "lenatramper",
    "uwelang"*/
];

// just for testing purposes you should see a Hello World on your console prio to any further activity
console.log('Starting my activities');
init();

//
// do some initial stuff like creating the dB connection
//
function init() {
    // create the mongo connection once to avoid millions of
    // connections slowing down the performance
    mongoclient.connect(config.mongo.url, function (err, db) {
        if (err)
            throw err;
        dbo = db.db(config.mongo.dbname);
        run();
    });
}

//
// will be called by init functions as callback to start program
//
function run() {
    //
    // I used mongo 3.6 for testing installed on an Ubuntu server (don't forget to open the firewall for port 27017)
    // For checking I installed mongodb also on my windows development client
    // using the compass client
    // looks like without any content there will be no DB, I assume the explicit createDB call is not required 
    //
    mongoapi.createMongoDB(config.mongo.url, config.mongo.dbname);
    // creates unique indeces for all payment relevant steem collections
    for (let i = 0; i < config.mongo.steam_ptrx_collections.length; i++) {
        mongoapi.createUniqueIndex(dbo, config.mongo.steem_ptrx_collection_prefix + config.mongo.steam_ptrx_collections[i], { account_hist_idx: 1, account_hist_name: 1 }, nullCB);
    }
    // create a unique index for the account stats collection
    // in case the the index was created we start the collection of data per account
    mongoapi.createUniqueIndex(dbo, config.mongo.steem_account_collection, "account", createAccountCollectionIndexCB);
    

    //
    // Do some analyses on the data
    // since all calls are asysnc you might not get any result at the first run
    //
    var currentYear = new Date().getUTCFullYear();
    for (let i = 0; i < test_account_names.length; i++) {
        // write output for each year
        for (var year = 2016; year <= currentYear; year++) {
            var csv = createCsvSteemOutputHeader();
            writeFile("d:\\temp\\steem" + '-' + test_account_names[i] + '-' + year + '.csv', csv);
            mongoapi.find(dbo, "steem_ptrx_claim_reward_balance", { timestamp: RegExp(year + '.*'), 'account_hist_name': test_account_names[i] }, { _id: 0 }, test_account_names[i], find_claim_reward_balanceCB);
            mongoapi.find(dbo, "steem_ptrx_author_reward", { timestamp: RegExp(year + '.*'), 'account_hist_name': test_account_names[i] }, { _id: 0 }, test_account_names[i], find_author_rewardCB);
            mongoapi.find(dbo, "steem_ptrx_curation_reward", { timestamp: RegExp(year + '.*'), 'account_hist_name': test_account_names[i] }, { _id: 0 }, test_account_names[i], find_curation_rewardCB);
        }
    }
    console.log('Good bye all actions triggered');
}

//
// Start collection of account transactions
// and general data of the accounts
//
function createAccountCollectionIndexCB(err, indexName) {
    if (err === null) {
        // some example account names to fill the 
        // transaction collections
 
        for (let i = 0; i < test_account_names.length; i++) {
            // search for the documente related to the account and do something with it
            mongoapi.find(dbo, config.mongo.steem_account_collection, { account: test_account_names[i] }, { _id: 0 }, test_account_names[i], createAccountDocCB);
        }

        // Update the steem account data, contains general data about the account
        // like number of posts, create date...
        steemapi.getAccounts(test_account_names, getAccountSummeriesCB);
    }
}

function evalAccountHistoryPayments(accountname, transaction, trxindex){
    //console.log("   transaction-block: " + transaction.block);
    let operation = transaction.op;
    //console.log("   transaction-id: " + transaction.trx_id + " timestamp: " + transaction.timestamp+" operationtype: " + operation[0]);
    // adding the account history index for each transaction
    transaction.account_hist_idx = trxindex;
    transaction.account_hist_name = accountname;

    for (let i = 0; i < config.mongo.steam_ptrx_collections.length; i++) {
        if (operation[0] === config.mongo.steam_ptrx_collections[i]) {
            mongoapi.insertObject(dbo, config.mongo.steem_ptrx_collection_prefix + operation[0], transaction);
            return trxindex;
        }
    }
    // no suitable operation found
    return -1;
}

//
// retrieve account history
//
function getAccountHistoryCB(accountname, from, high, err, result = []) {
    if (err == null) {
        let finalcall = false;
        // we should get an array with data of accounts
        if (result.length > 0) {
            let lastindex = result[result.length - 1][0];
            if (high === -1) {
                mongoapi.updateOne(dbo, config.mongo.steem_account_collection, { account: accountname }, { $set: { high_ptrx: lastindex } }, updateOneCB)
                high = lastindex;
            }
            let newfrom = lastindex - (config.steem.accounthistmaxretr + 1);
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
                    console.log("getAccountHistory for " + accountname + " done. LastIndex: " + lastindex);
            }
        }
        else
            console.log("no data retrieved for account: " + account);

        let trxindex = -1;
        let handled = false;
        for (let i = (result.length - 1); i >= 0; i--) {
            //console.log(result);
            //console.log("history-ID: " + result[i][0]);
            let transaction = result[i][1];

            let returnval = evalAccountHistoryPayments(accountname, transaction, result[i][0]);
            if (returnval == -1) {
                //console.log("   transaction-block: " + transaction.block);
                let operation = transaction.op;
                //console.log("   transaction-id: " + transaction.trx_id + " timestamp: " + transaction.timestamp+" operationtype: " + operation[0]);
                for (let j = 0; j < config.mongo.steem_otrx_collection.length; j++) {
                    if (operation[0] === config.mongo.steem_otrx_collection[j]) {
                        // operation listed, no new operation found
                        // this piece is just for tet pruposes to ensure I have learned all possible operations
                        handled = true;
                        break;
                    }
                }
            } else {
                trxindex = returnval;
                handled = true;
            }

            if (handled != true) {
                console.log("unhandled opertion: " + operation[0]);
            }
        }
        // update latest insert stat
        // this update will not work properly as the functions are asyncronous therefore later calls might be earlier and  overwritten
        if (trxindex != -1) { 
            mongoapi.updateOne(dbo, config.mongo.steem_account_collection, { account: accountname }, { $set: { low_ptrx: trxindex } }, updateOneCB);
            //console.log("getAccountHistory for account: " + accountname + " updaterequest low_ptrx: " + trxindex)
        }
    } else {
        //err!=null
        console.log("getAccountHistory for account :" +accountname+" failed "+err);
    }
}

function getFloatValue(pValue, pFactor) {
    if (pValue === undefined || pValue === null || pValue === '')
        return null;
    var separator = pValue.indexOf(' ');
    if (separator > 0) {
        return parseFloat(pValue.substring(0, separator)) * (pFactor !== undefined && pFactor !== null ? pFactor : 1.0);
    }
    return null;
}

function find_curation_rewardCB(err, result = [], customdata) {
    if (err == null) {
        let steem = 0;
        let sbd = 0;
        let vests = 0;

        for (let i = 0; i < result.length; i++) {
            let transaction = result[i];
            let op = transaction.op;
            let operation = op[1];

            vests = getFloatValue(operation.reward);

            //
            // Export to CSV
            //
            let csv = "";
            let timestamp = new Date(transaction.timestamp);
            let year = timestamp.getFullYear();
            let month = timestamp.getMonth() + 1;
            let filename = "d:\\temp\\steem" + '-' + customdata + '-' + year + '.csv';

            /*
            // Master CSV Data Line
            csv = "year;" + "quarter;" + "month;" + "week;" + "currency;" + "date;" + "date / time;" + "transaction id;" + "In/out;" + "Type;";
            csv += "From Account;" + "ToAccount;" + "Info;" + "EUR Prior Balance;" + "EUR Amount" + "EUR Capital Gain;" + "From Type;";
            csv += "To Type;" + "Amount;"+"Prior Balance;"+"Balance;"+"EUR-SBD Rate;"+"EUR-Steem Rate;"+"EUR-VESTS Rate"+ '\n';
            */
            if (vests != 0) {
                csv = year + ";" + "quarter;" + month + ";" + "week;" + "VESTS;" + "date;" + transaction.timestamp + ";" + transaction.account_hist_idx + ";" + "IN;" + "CURATION REWARD;";
                csv += operation.comment_author + ";" + operation.curator + ";" + ";" + "EUR Prior B;" + "EUR A;" + "EUR B;" + "EUR C Gain;" + "SELF;";
                csv += "SELF;" + vests + ";" + "Prior B;" + "Balance;" + ";" + ";" + "EUR-VESTS Rate" + '\n';
                appendFile(filename, csv);
            }
        } // endof for
        console.log("find_curation_rewardCB for " + customdata + " done");
    } else {
        console.log("find_curation_rewardCB failed");
    }
}

function find_author_rewardCB(err, result = [], customdata) {
    if (err == null) {
        let steem = 0;
        let sbd = 0;
        let vests = 0;

        for (let i = 0; i < result.length; i++) {
            let transaction = result[i];
            let op = transaction.op;
            let operation = op[1];

            sbd = getFloatValue(operation.sbd_payout);
            steem = getFloatValue(operation.steem_payout);
            vests = getFloatValue(operation.vesting_payout);

            //
            // Export to CSV
            //
            let csv = "";
            let timestamp = new Date(transaction.timestamp);
            let year = timestamp.getFullYear();
            let month = timestamp.getMonth() + 1;
            let filename = "d:\\temp\\steem" + '-' + customdata + '-' + year + '.csv';

            /*
            // Master CSV Data Line
            csv = "year;" + "quarter;" + "month;" + "week;" + "currency;" + "date;" + "date / time;" + "transaction id;" + "In/out;" + "Type;";
            csv += "From Account;" + "ToAccount;" + "Info;" + "EUR Prior Balance;" + "EUR Amount" + "EUR Capital Gain;" + "From Type;";
            csv += "To Type;" + "Amount;"+"Prior Balance;"+"Balance;"+"EUR-SBD Rate;"+"EUR-Steem Rate;"+"EUR-VESTS Rate"+ '\n';
            */
            if (sbd != 0) {
                csv = year + ";" + "quarter;" + month + ";" + "week;" + "SBD;" + "date;" + transaction.timestamp + ";" + transaction.account_hist_idx + ";" + "IN;" + "AUTHOR REWARD;";
                csv += operation.author + ";" + customdata + ";" + ";" + "EUR Prior B;" + "EUR A;" + "EUR B;" + "EUR C Gain;" + "SELF;";
                csv += "SELF;" + sbd + ";" + "Prior B;" + "Balance;" + "EUR-SBD R;" + ";" + "" + '\n';
                appendFile(filename, csv);
            }
            if (steem != 0) {
                csv = year + ";" + "quarter;" + month + ";" + "week;" + "STEEM;" + "date;" + transaction.timestamp + ";" + transaction.account_hist_idx + ";" + "IN;" + "AUTHOR REWARD;";
                csv += operation.author + ";" + customdata + ";" + ";" + "EUR Prior B;" + "EUR A;" + "EUR B;" + "EUR C Gain;" + "SELF;";
                csv += "SELF;" + steem + ";" + "Prior B;" + "Balance;" + ";" + "EUR-Steem R;" + "" + '\n';
                appendFile(filename, csv);
            }
            if (vests != 0) {
                csv = year + ";" + "quarter;" + month + ";" + "week;" + "VESTS;" + "date;" + transaction.timestamp + ";" + transaction.account_hist_idx + ";" + "IN;" + "AUTHOR REWARD;";
                csv += operation.author + ";" + customdata + ";" + ";" + "EUR Prior B;" + "EUR A;" + "EUR B;" + "EUR C Gain;" + "SELF;";
                csv += "SELF;" + vests + ";" + "Prior B;" + "Balance;" + ";" + ";" + "EUR-VESTS Rate" + '\n';
                appendFile(filename, csv);
            }
        } // endof for
        console.log("find_author_rewardCB for " + customdata + " done");
    } else {
        console.log("find_author_rewardCB failed");
    }
}

function find_claim_reward_balanceCB(err, result = [], customdata) {
    if (err == null) {
        let steem=0;
        let sbd=0;
        let vests = 0;

        for (let i = 0; i < result.length; i++) {
            let transaction = result[i];
            let op = transaction.op;
            let operation = op[1];

            sbd = getFloatValue(operation.reward_sbd);
            steem = getFloatValue(operation.reward_steem);
            vests = getFloatValue(operation.reward_vests);

            //
            // Export to CSV
            //
            let csv = "";
            let timestamp = new Date(transaction.timestamp);
            let year = timestamp.getFullYear();
            let month = timestamp.getMonth()+1;
            let filename = "d:\\temp\\steem" + '-' + customdata + '-' + year + '.csv';

            /*
            // Master CSV Data Line
            csv = "year;" + "quarter;" + "month;" + "week;" + "currency;" + "date;" + "date / time;" + "transaction id;" + "In/out;" + "Type;";
            csv += "From Account;" + "ToAccount;" + "Info;" + "EUR Prior Balance;" + "EUR Amount" + "EUR Capital Gain;" + "From Type;";
            csv += "To Type;" + "Amount;"+"Prior Balance;"+"Balance;"+"EUR-SBD Rate;"+"EUR-Steem Rate;"+"EUR-VESTS Rate"+ '\n';
            */
            if (sbd != 0) {
                csv = year + ";" + "quarter;" + month + ";" + "week;" + "SBD;" + "date;" + transaction.timestamp + ";" + transaction.account_hist_idx + ";" + "N/A;" + "CLAIM;";
                csv += operation.account + ";" + customdata + ";" + ";" + "EUR Prior B;" + "EUR A;" + "EUR B;" + "EUR C Gain;" + "SELF;";
                csv += "SELF;" + sbd + ";" + "Prior B;" + "Balance;" + "EUR-SBD R;" + ";" + "" + '\n';
                appendFile(filename, csv);
            }
            if (steem != 0) {
                csv = year + ";" + "quarter;" + month + ";" + "week;" + "STEEM;" + "date;" + transaction.timestamp + ";" + transaction.account_hist_idx + ";" + "N/A;" + "CLAIM;";
                csv += operation.account + ";" + customdata + ";" + ";" + "EUR Prior B;" + "EUR A;" + "EUR B;" + "EUR C Gain;" + "SELF;";
                csv += "SELF;" + steem + ";" + "Prior B;" + "Balance;" + ";" + "EUR-Steem R;" + "" + '\n';
                appendFile(filename, csv);
            }
            if (vests != 0) {
                csv = year + ";" + "quarter;" + month + ";" + "week;" + "VESTS;" + "date;" + transaction.timestamp + ";" + transaction.account_hist_idx + ";" + "N/A;" + "CLAIM;";
                csv += operation.account + ";" + customdata + ";" + ";" + "EUR Prior B;" + "EUR A;" + "EUR B;" + "EUR C Gain;" + "SELF;";
                csv += "SELF;" + vests + ";" + "Prior B;" + "Balance;" + ";" + ";" + "EUR-VESTS Rate" + '\n';
                appendFile(filename, csv);
            }            
        } // endof for
        console.log("find_claim_reward_balanceCB for " + customdata + " done");
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
            steem_data : "",
            low_ptrx: -1,
            high_ptrx: -1
        };
        // insert a document/object which is similar to create a record in a classic SQL DB
        mongoapi.insertObject(dbo, config.mongo.steem_account_collection, accountdoc);
        steemapi.getAccountHistory(customdata, -1, config.steem.accounthistmaxretr, -1 , getAccountHistoryCB);
    }
    if (result.length === 1) {
        // one result 
        let from = result[0].low_ptrx-1; // start one lower than stopped
        let high = result[0].high_ptrx;
        if (from <= -1 && high === -1) {
            // nothing done yet can happen when program is stopped between updated
            steemapi.getAccountHistory(customdata, -1, config.steem.accounthistmaxretr, -1, getAccountHistoryCB);
        } else {
            if (from >= config.steem.accounthistmaxretr)
                steemapi.getAccountHistory(customdata, from, config.steem.accounthistmaxretr, high, getAccountHistoryCB);
            else {
                if (from > 0)
                    steemapi.getAccountHistory(customdata, from, from, high, getAccountHistoryCB);
                else {
                    console.log("createAccountDocCB nothing to do for "+customdata);
                }
            }
        }
    }
}

function updateAccountDataCB(err, result, customdata) {
    if (result.length === 1) {
        mongoapi.updateOne(dbo, config.mongo.steem_account_collection, { account: result[0].account }, { $set: { steem_data: customdata } }, updateAccountDataDoneCB)
    }
}

//
// requests details of an array of accounts
// since the functions are asynchronous you need to work with callbacks to get the data
//
function getAccountSummeriesCB(err, result = []) {
    if (err == null) {
        // we should get an array with data of accounts
        for (let i = 0; i < result.length; i++) {

            console.log("account-ID: " + result[i].id + " account-name:" + result[i].name + " number of posts:" + result[i].post_count);

            for (let j = 0; j < result[i].transfer_history.length; j++) {
                console.log(result[i].transfer_history[j]);
            }
            mongoapi.find(dbo, config.mongo.steem_account_collection, { account: result[i].name }, { _id: 0 }, result[i], updateAccountDataCB);
        }
    } else {
        console.log("getAccount failed");
    }
}

function appendFile(pFilename, pContent) {
    try {
        fs.appendFileSync(pFilename, pContent);
    } catch (ex) {
        console.error('> Error occured: ' + ex);
        throw ex;
    }
}

function writeFile(pFilename, pContent) {
    try {
        if (fs.existsSync(pFilename))
            fs.unlinkSync(pFilename);
        fs.writeFileSync(pFilename, pContent);
    } catch (ex) {
        console.error('> Error occured: ' + ex);
        throw ex;
    }
}

function createCsvSteemOutputHeader() {
    try {
        var output = '';
        output += 'Year;';
        output += 'Quarter;';
        output += 'Month;';
        output += 'Week;';
        output += 'Currency;';
        output += 'Date;';
        output += 'Date/Time;';
        output += 'Transaction ID;';
        output += 'In/Out;';
        output += 'Type;';
        output += 'From Account;';
        output += 'To Account;';
        output += 'Info;';
        output += 'EUR Prior Belance;';
        output += 'EUR Amount;';
        output += 'EUR Balance;';
        output += 'EUR Capital Gain;';
        output += 'From Type;';
        output += 'To Type;';
        output += 'Amount;';
        output += 'Prior Balance;';
        output += 'Balance;';
        output += 'EUR-SBD Rate;';
        output += 'EUR-STEEM Rate;';
        output += 'EUR-VESTS Rate;';
        output += '\n';
        return output;
    } catch (error) {
        console.error(error);
    }
}


function nullCB() { }
function updateAccountDataDoneCB(err, result) {}
function updateOneCB(err, result, newvalues) {
    if (err != null) {
        console.log(err);
    }
    else {
        //console.log("updateOneCB newvals: " + newvalues.$set.low_ptrx);
    }
}



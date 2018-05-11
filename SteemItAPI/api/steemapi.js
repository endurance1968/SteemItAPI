// 
// my library to access steemit
//

var steem = require('steem');

exports.vote = function (authaccount,authpwd,fromusername, tousername, articlename) {
    var wif = steem.auth.toWif(authaccount,authpwd, 'posting');
    steem.broadcast.vote(wif, fromusername, tousername, articlename, 10000, function (err, result) {
        console.log(err, result);
    });
}

exports.getAccounts = function (accounts,callback) {
    steem.api.getAccounts(accounts, function (err, result) {
        callback(err,result);
    });
}

// from must be greater than limit (or -1)
exports.getAccountHistory = function (accountname, from=-1, limit=1, high=-1, callback) {
    steem.api.getAccountHistory(accountname, from, limit, function (err, result) {
        callback(accountname, from, high, err, result);
    });
}
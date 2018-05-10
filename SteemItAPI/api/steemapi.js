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

exports.getAccountHistory = function (account,from=-1,limit=1, callback) {
    steem.api.getAccountHistory(account, from, limit, function (err, result) {
        callback(err, result);
    });
}
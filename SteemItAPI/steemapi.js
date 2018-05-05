// 
// my library to access steemit
//

var steem = require('steem');

exports.vote = function (wif, fromusername,tousername,articlename) {
    steem.broadcast.vote(wif, fromusername, tousername, articlename, 10000, function (err, result) {
        console.log(err, result);
    });
}

exports.getAccounts = function (accounts) {
    steem.api.getAccounts(accounts, function (err, result) {
        console.log(err, result);
    });
}
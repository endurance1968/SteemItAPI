'use strict';

// import common steem API
var steem = require('steem');

// import my steem api module
var steemapi = require('./steemapi');
var config = require('./config');

// just for testing purposes you should see a Hello World on your console prio to any further activity
console.log('Hello world');

// now do some real action
// your user is used to upvote the article steemitapitest of user endurance1968
// creates a encoded hash to autorize yourself with posting role
/*
var wif = steem.auth.toWif(config.steem.username, config.steem.password, 'posting');
steemapi.vote(wif, config.steem.username, 'endurance1968', 'steemitapitest');
*/

// requests details of an array of accounts
steemapi.getAccounts([config.steem.username]);

console.log('Good bye');
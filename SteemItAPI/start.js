'use strict';

// import common steem API
var steem = require('steem');

// import my steem api module
var steemapi = require('./steemapi');

var username = 'YOUR USERNAME';
// your master password! :(
var password = 'YOUR PWD';
// creates a encoded hash to autorize yourself
var wif = steem.auth.toWif(username, password, 'posting');

// just for testing purposes you should see a Hello World on your console prio to any further activity
console.log('Hello world');

// now do some real action
// your user is used to upvote the article steemitapitest of user endurance1968
steemapi.vote(wif, username,'endurance1968','steemitapitest');
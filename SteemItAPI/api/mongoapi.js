var mongoclient = require('mongodb').MongoClient;
var mongo = require('mongodb');

exports.createMongoDB = function(url,dbname) {
    mongoclient.connect(url+dbname, function (err, db) {
        if (err)
            throw err;
        //console.log("Database created!");
        db.close();
    });
}


exports.createCollection = function (dbo, collection) {
    dbo.createCollection(collection, function (err, res) {
        if (err)
            throw err;
        console.log("Collection "+collection+" created!");
    });
}

exports.insertObject = function (dbo, collection,myobj) {
        dbo.collection(collection).insertOne(myobj, function (err, res) {
        if (err)
            throw err;
    });
}

//
// Returns all objects of an collection
// limiting the return fields as specified in fields
// e.g. { _id: 0, name: 1, address: 1 }
// where 0 means do not return
// You are not allowed to specify both 0 and 1 values in the same object (except if one of the fields is the _id field). 
// If you specify a field with the value 0, all other fields get the value 1, and vice versa
//
exports.find = function (dbo, collection, query , fields , customdata, callback) {
    dbo.collection(collection).find(query,fields).toArray(function (err, result) {
        if (err)
            throw err;
        callback(err, result, customdata);
    });
}

exports.createUniqueIndex = function (dbo, collection, index, callback) {
    dbo.collection(collection).createIndex(index, { unique: true }, function (err, result) {
        if (err)
            throw err;
        callback(err, result);
    });
}

exports.createIndex = function (dbo, collection, index, callback) {
    dbo.collection(collection).createIndex(index, function (err, result) {
        if (err)
            throw err;
        callback(err,result);
    });
}

exports.updateOne = function (dbo, collection, query, newvalues, callback) {
    dbo.collection(collection).updateOne(query, newvalues, function (err, result) {
        if (err)
            throw err;
        callback(err,result)
    });
}
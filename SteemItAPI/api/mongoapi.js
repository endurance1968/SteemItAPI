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

exports.createCollection = function (url,dbname,collection) {
    mongoclient.connect(url, function (err, db) {
        if (err)
            throw err;
        var dbo = db.db(dbname);
        dbo.createCollection(collection, function (err, res) {
            if (err)
                throw err;
            //console.log("Collection "+collection+" created!");
            db.close();
        });
    });
}

exports.insertObject = function (url, dbname, collection,myobj) {
    mongoclient.connect(url, function (err, db) {
        if (err)
            throw err;
        var dbo = db.db(dbname);
        dbo.collection(collection).insertOne(myobj, function (err, res) {
            if (err)
                throw err;
            //console.log("1 document inserted");
            db.close();
        });
    });
}
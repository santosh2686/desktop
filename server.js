var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var app = express();
var objectId = require('mongodb').ObjectID;
var bodyParser = require('body-parser');
var url = require('url');
var qs = require('querystring');
var path = require("path");
var dbUrl='mongodb://localhost:27017/';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(__dirname + '/dist'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});


app.route('/api/:databse/:collection')
.get(function(req,res){
    var database = req.params.databse;
    var collection = req.params.collection;
    var queryObject = url.parse(req.url,true).query;
    var q=queryObject.q?JSON.parse(queryObject.q):{};
    var f=queryObject.f?JSON.parse(queryObject.f):{};
    var s=queryObject.s?JSON.parse(queryObject.s):{};
    
    if(q._id){
        q._id=objectId(q._id);
    }
    
    MongoClient.connect(dbUrl+database,function(err,db){
        if(!err){
            db.collection(collection,function(err, collection) {
                collection.find(q,f).sort(s).toArray(function(err, items) {
                    res.send(items);
                    db.close();
                });
            });
        }else{
            res.send('Database is not connected...');
        }
    });
})
.post(function(req,res){
    var database = req.params.databse;
    var collection = req.params.collection;
    var item = req.body;
    MongoClient.connect(dbUrl+database,function(err,db){
        if(!err){
            db.collection(collection, function(err, collection) {
                collection.insert(item, {safe:true}, function(err, result) {
                    if(!err)
                    {
                        res.send(result);
                    }else{                        
                        res.send(err);
                    }
                });
            });
        }else{
            res.send('Database is not connected...');
        }
    });
})
.put(function(req,res){
    var database = req.params.databse;
    var collection = req.params.collection;
    var queryObject = url.parse(req.url,true).query;
    var q=queryObject.q?JSON.parse(queryObject.q):{};
    var item = req.body;
    if(q._id){
        q._id=objectId(q._id);
    }
    MongoClient.connect(dbUrl+database,function(err,db){
        if(!err){
            db.collection(collection,function(err,collection){
                collection.update(q,{$set:item},function(err,result){
                    if(!err){
                        res.send(result);
                    }else{
                        res.send(err);
                    }
                 });
            });
        }else{
            res.send('Database is not connected...');
        }
    })
});

//Delete Record
app.route('/api/:databse/:collection/:id')
.delete(function(req,res){
     var databaseName = req.params.databse;
    var collectionName = req.params.collection;
    var recordId = req.params.id;
    MongoClient.connect(dbUrl+databaseName,function(err,db){
        if(!err){            
            db.collection(collectionName,function(err,collection){
                if(!err){                   
                    collection.remove({'_id':objectId(recordId)},{safe:true},function(err, result){
                        if(!err){
                            res.send(result);
                        }else{
                            res.send(err);
                        }
                    });
                }
                
            });
        }else{
            res.send('Database is not connected...');
        }
    })
});  

app.listen(8080);
console.log('Application Running on port : 8080');
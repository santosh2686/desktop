var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var app = express();
var objectId = require('mongodb').ObjectID;
var bodyParser = require('body-parser');
var url = require('url');
var qs = require('querystring');
var path = require("path");
var dbUrl='mongodb://localhost:27017/';

//Window Functions and Events
//https://github.com/nwjs/nw.js/wiki/window

//Build the EXE
//Build zip file of entire files and then paste in the directory where we have nw.exe and run the following command.
//copy /b nw.exe+app.nw app.exe 

//Ref : 
//https://www.scirra.com/tutorials/1359/distributing-using-node-webkit-for-free-windows


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(__dirname + '/dist'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

/*
db.authenticate('admin1', 'pass123', function(err, result) {
  if(!err){
	res.send('Authentication Success');
  }
});
*/

/*db.addUser('admin', 'pass123', function(err, result) {
	if(!err){
		res.send('User Addded');
	}else{
		res.send('Failed')
	}
})*/

app.route('/api/:databse/:collection')
.get(function(req,res){
    var database = req.params.databse;
    var collection = req.params.collection;
    var queryObject = url.parse(req.url,true).query;
    var q=queryObject.q?JSON.parse(queryObject.q):{};
    var f=queryObject.f?JSON.parse(queryObject.f):{};
    var s=queryObject.s?JSON.parse(queryObject.s):{};    
    var c = queryObject.c;
    if(q._id){
        q._id=objectId(q._id);
    }
	//Inline authentication for database
	//MongoClient.connect('mongodb://admin:pass123@localhost:27017/travel',function(err,db){	
    MongoClient.connect(dbUrl+database,function(err,db){		
        if(!err){
            db.collection(collection,function(err, collection) {
                if(c){
                    collection.count(q,function(err,count){
                        res.sendStatus(count);
                        db.close();
                    });
                }else{
                    collection.find(q,f).sort(s).toArray(function(err, items) {
                        res.send(items);
                        db.close();
                    });
                }
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
	var a = queryObject.action;
    var q=queryObject.q?JSON.parse(queryObject.q):{};
    var item = req.body;
    if(q._id){
        q._id=objectId(q._id);
    }
    MongoClient.connect(dbUrl+database,function(err,db){
        if(!err){
            db.collection(collection,function(err,collection){
                collection.update(q,item,function(err,result){
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
    });
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
var port = process.env.PORT || 9090;
app.listen(port);
console.log('Application Running on port : ' + port);

const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();
const objectId = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const compression = require('compression');
const url = require('url');
const qs = require('querystring');
const path = require("path");
const session = require('express-session');

const dbUrl="mongodb+srv://admin:admin@travel.ecepf.mongodb.net?retryWrites=true&w=majority";

app.use(session({
    secret: '278sbkn4-4Dsahn44-WppQ38S-qwhbk456-80nshdnfh-78sdfgnk10376s',
    name: 'sessionId',
    resave: true,
    saveUninitialized: true
  }));

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(__dirname + '/dist'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});


// Authentication and Authorization Middleware
const auth = function (req, res, next) {
    if (req.session && req.session.loggedIn) {
      next();
    } else {
      res.sendStatus(401);
    }
};

  let db;
  const connectionOptions = {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     compression: ["snappy", "zlib"]
  }

 MongoClient.connect(dbUrl, connectionOptions, function(err, client) {		
    if (err){
        console.log('Database is not connected...');
        return;
    }
    db = client.db('travel-agency');
    var port = process.env.PORT || 9090;
    app.listen(port, () => {
        console.log('Application Running on port : '+port);
    });
});

app.get('/login', function(req, res) {
    const queryObject = url.parse(req.url, true).query;
    const userName = queryObject.userName;
    const userPassword = queryObject.password;
    if(!userName || !userPassword) {
        res.sendStatus(401);
    } else {
        db.collection('login', function(err, collection) {
            collection.find(queryObject).toArray(function(err, items) {
                if (!items.length) {
                    res.sendStatus(401);
                } else {
                    req.session.loggedIn = true;
                    res.send('Login successful')
                }
            });
        });
    }
})

app.get('/logout', function (req, res) {
    req.session.destroy(function () {
      console.log('User logged Out.');
    });
    res.send("logout success!");
  });
  

app.use(auth, function(req, res, next) {
    next()
})

app.route('/v1/:collection')
.get(function(req,res) {
    var collection = req.params.collection;
    var queryObject = url.parse(req.url,true).query;
    var q=queryObject.q?JSON.parse(queryObject.q):{};
    var f=queryObject.f?JSON.parse(queryObject.f):{};
    var s=queryObject.s?JSON.parse(queryObject.s):{};    
    var c = queryObject.c;
    if(q._id){
        q._id=objectId(q._id);
    }
    db.collection(collection,function(err, collection) {
        if(c){
            collection.count(q,function(err,count){
                res.sendStatus(count);
            });
        }else{
            collection.find(q,f).sort(s).toArray(function(err, items) {
                res.send(items);
            });
        }
    });
})
.post(function(req,res){
    var collection = req.params.collection;
    var item = req.body;
    db.collection(collection, function(err, collection) {
        collection.insertOne(item, {safe:true}, function(err, result) {
            if(!err)
            {
                res.send(result);
            }else{                        
                res.send(err);
            }
        });
    });
})
.put(function(req,res){
    var collection = req.params.collection;
    var queryObject = url.parse(req.url,true).query;
	var a = queryObject.action;
    var q=queryObject.q?JSON.parse(queryObject.q):{};
    var item = req.body;
    if(q._id){
        q._id=objectId(q._id);
    }
    db.collection(collection,function(err,collection){
        collection.updateOne(q,item,function(err,result){
            if(!err){
                res.send(result);
            }else{
                res.send(err);
            }
         });
    });
});

//Delete Record
app.route('/v1/:collection/:id')
.delete(function(req,res){
    var collectionName = req.params.collection;
    var recordId = req.params.id;
    db.collection(collectionName,function(err,collection){
        if(!err){          
            collection.deleteOne({'_id':objectId(recordId)},{safe:true},function(err, result){
                if(!err){
                    res.send(result);
                }else{
                    res.send(err);
                }
            });
        }
        
    });
});

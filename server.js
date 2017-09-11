const express = require('express');
const app = express();
const http = require('http');
const url = require('url');
const qs = require('querystring');
const request = require('request');

const port = process.env.PORT || 9090;
const proxyMiddleware = require('http-proxy-middleware');


const HttpsProxyAgent = require('https-proxy-agent');
const proxy = process.env.https_proxy || process.env.HTTPS_PROXY;
const agent = new HttpsProxyAgent(proxy);


const session = require('express-session');
app.use(session({
  secret: '278sbkn4-4Dsahn44-WppQ38S-qwhbk456-80nshdnfh-78sdfgnk10376s',
  resave: true,
  saveUninitialized: true
}));

app.use(express.static(__dirname + '/dist'));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// Authentication and Authorization Middleware
const auth = function (req, res, next) {
  if (req.session && req.session.user === "balaji" && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};


const loginCall = function (req, res, next) {
  const data = url.parse(req.url, true).query;
  if (!data.userName || !data.password) {
    res.sendStatus(401);
  } else {
    request('https://api.mongolab.com/api/1/databases/travel/collections/login?apiKey=NNY26lvUYux1Rz5H-7QLgNB28lsBmg0K&f={"id":1}&q={"userName":"' + data.userName + '","password":"' + data.password + '"}',
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          const resposnse = JSON.parse(body);
          if (resposnse.length == 1) {
            return next();
          } else {
            return res.sendStatus(401);
          }
        } else {
          return res.sendStatus(401);
        }
      });
  }
};

app.get('/login', loginCall, (req, res, next) => {
  const queryObject = url.parse(req.url, true).query;
  req.session.user = queryObject.userName;
  req.session.admin = true;
  res.send("login success!");
});

app.get('/logout', function (req, res) {
  req.session.destroy();
  res.send("logout success!");
});

app.use('/v1/**', auth, proxyMiddleware({
  target: 'https://api.mongolab.com',
  changeOrigin: true,
  secure: false,
  agent: agent,
  pathRewrite: {
    '^/v1/': '/'
  },
  onProxyReq: (proxyReq, req) => {
    console.log(req.method, req.path, '->', 'https://api.mongolab.com' + proxyReq.path);
  }
}));


app.listen(port, function () {
  console.log('Application Running on port: ' + port);
});

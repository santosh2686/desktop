const express = require('express');
const app = express();
const http = require('http');
const url = require('url');
const qs = require('querystring');
const request = require('request');
const nodemailer = require('nodemailer');
const port = process.env.PORT || 9090;
const proxyMiddleware = require('http-proxy-middleware');

/*

const HttpsProxyAgent = require('https-proxy-agent');
const proxy = process.env.https_proxy || process.env.HTTPS_PROXY;
const agent = new HttpsProxyAgent(proxy);

*/

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
          const apiRes = JSON.parse(body);
          if (apiRes.length == 1) {
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

const verifyUserByEmail = function (req, res, next) {
  const queryObject = url.parse(req.url, true).query;
  const email = queryObject.email;
  request('https://api.mongolab.com/api/1/databases/travel/collections/login?apiKey=NNY26lvUYux1Rz5H-7QLgNB28lsBmg0K&q={"email":"' + email + '"}',
    function (error, response, body) {
      const apiRes = JSON.parse(body);
      if (apiRes.length == 1) {
        req.user = apiRes[0];
        next();
      } else {
        return res.sendStatus(401);
      }
    })
};

const emailLoginDetails = function (req, res, next) {
  const queryObject = url.parse(req.url, true).query;
  const email = queryObject.email;
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'frontend2686@gmail.com',
      pass: 's9870151748'
    }
  });
  var mailOptions = {
    from: 'frontend2686@gmail.com',
    to: 'santosh2686@gmail.com',
    subject: 'Login details',
    html: '<table border="1" cellspacing="0" cellpadding="8" style="border-spacing:0; border-collapse: collapse; font-family: Arial; margin:20px 0"><tr><th>UserName/th><th>Password</th></tr><tr><td>'+req.user.userName+'</td><td>'+req.user.password+'</td></tr></table>',
  };
  transporter.sendMail(mailOptions, function(error, info){
    console.log(error);
    if (error) {
      return res.sendStatus(401);
    } else {
      console.log('Email sent: ' + info.response);
      next();
    }
  });
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

app.get('/forgotPassword', verifyUserByEmail, emailLoginDetails, (req, res, next) => {
  res.send('Email Sent!!!');
});

app.use('/v1/**', auth, proxyMiddleware({
  target: 'https://api.mongolab.com',
  changeOrigin: true,
  secure: false,
  // agent: agent,
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

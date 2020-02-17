/*
  $ heroku login
  $ git init
  $ heroku git:remote -a deltav

  $ git add .
  $ git commit -am "Update"
  $ git push heroku master
*/



const http = require('http');

const db = require('./js/database.js');

const server = http.createServer((req, res) => {

  var url = req.url;
  console.log(url);

  // set allowed origins here
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', ['Content-Type']);
  res.setHeader('Access-Control-Expose-Headers', ['Content-Type', 'Allow']);

  // if running an API request
  if (url == '/api/database/query') {
    
    var body = [];
    req.on('error', function(err) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end(err);
    }).on('data', function(chunk) {
      body.push(chunk);
    }).on('end', function() {
      body = Buffer.concat(body).toString();

      // this is all the data for the inbound request
      var data = {
        headers: req.headers,
        url: req.url,
        method: req.method,
        body: body,
        res: res
      };

      console.log(body);

      try {
        var query = JSON.parse(body).query;
        console.log(query);
        db.runQuery(query, function(error, data) {
          if (error != null) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({data: null, error: error}));
          } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({data: data, error: null}));
          }
        })



      } catch(e) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({data: null, error: 'Invalid or Empty JSON Body'}));
      }



    });

  } else {
    // otherwise return blank page
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('D E L T A   V');
  }

});

server.listen(process.env.PORT || 3000);
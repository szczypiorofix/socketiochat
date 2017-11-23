const http = require('http');
const url = require('url');
const hostname = '127.0.0.1';
const port = 8000;

var mainUrl = '';

const server = http.createServer((request, response) => {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write('Hello NodeJS !\n');
  
  mainUrl = 'http://'+hostname+':' +port +request.url;
  
  response.write('You are in '+mainUrl +'\n');
  
  var u = url.parse(mainUrl, true);
  console.log(u);

  response.end();
  }).listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
  });
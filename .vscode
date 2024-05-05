//creates a variable called http then assigns to it an instance of the HTTP module, which imports HTTP//
const url = require('url');
const http = require('http');
const fs = require('fs');
    
//With HTTP imported, it allows you to use the createServer function //
http.createServer((request, response) => {
    let addr = request.url,
        q = new URL(addr,'http://localhost:8080'),
        filePath = '';
    
    //if url contains 'documentation', return documentation.html, otherwise return index.html
    if (q.pathname.includes('documentation')) {
        filePath = (__dirname + '/documentation.html');
      } else {
        filePath = 'index.html';
      }
    
    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Added to log.');
        }
    });
    
      if (q.pathname.includes('documentation')) {
        filePath = (__dirname + '/documentation.html');
      } else {
        filePath = 'index.html';
      }

    fs.readFile(filePath, (err, data) => {
        if (err) {
          throw err;
        }
    
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(data);
        response.end();
    
      });
//listens to requests on port 8080//
}).listen(8080);
console.log('My first Node test server is running on Port 8080.');
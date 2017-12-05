var http = require('http'),
fs   = require('fs'),
filePath = 'song2.mp3',
stat = fs.statSync(filePath);

http.createServer(function(request, response) {
    response.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
    });
    fs.createReadStream(filePath).pipe(response);
})
.listen(9000);
var http = require('http');
var fs = require('fs');

var songName1 = 'song1.mp3';
var songFile1 = fs.statSync(songName1);

var songName2 = 'song2.mp3';
var songFile2 = fs.statSync(songName2);

var songName3 = 'song3.mp3';
var songFile3 = fs.statSync(songName3);


http.createServer(function(request, response) {
    if (request.url == '/song1') {
        response.writeHead(200, {
            'Content-Type': 'audio/mpeg',
            'Content-Length': songFile1.size
        });
        fs.createReadStream(songName1).pipe(response);
    }
    if (request.url == '/song2') {
        response.writeHead(200, {
            'Content-Type': 'audio/mpeg',
            'Content-Length': songFile2.size
        });
        fs.createReadStream(songName2).pipe(response);
    }
    if (request.url == '/song3') {
        response.writeHead(200, {
            'Content-Type': 'audio/mpeg',
            'Content-Length': songFile3.size
        });
        fs.createReadStream(songName3).pipe(response);
    }    
})
.listen(9000);
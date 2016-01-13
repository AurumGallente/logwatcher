var express = require('express');
var app = express();
var fs = require('fs');
var eolPosition;
var result='';
var myChar='';
var fileName = './error-dev.log';
var buffer;
var res;
function setChar(nextChar, cb){
    res = myChar.concat(nextChar);
    myChar += nextChar;    
    (!!cb) ? cb(myChar) : false;
    return myChar;
}
function getFuckingString(cb){
    fs.open(fileName, 'r', function(status, fd) {
        if (status) {
            console.log(status.message);
            return;
        }
        buffer = new Buffer(100);
        buffer.fill(0);
        fs.read(fd, buffer, 0, 4, 0, function(err, num) {
            setChar(buffer.toString(), cb);
    });
}
app.get('/', function(req, res) {
    var start = 0;
    res='';
    getFuckingString(console.log);
});
app.listen(3000);
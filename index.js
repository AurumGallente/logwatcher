var express = require('express');
var app = express();
var fs = require('fs');
var eolPosition;
var result='';
var char;
app.get('/', function(req, res) {
    var start = 0;
		var a = '';
    var fileName = './error-dev.log';
fs.open(fileName, 'r', function(status, fd) {
    if (status) {
        console.log(status.message);
        return;
    }

		do {
			var buffer = new Buffer(1);
			buffer.fill(0);
			var a=fs.readSync(fd, buffer, 0, 1, start, function(err, num, buff) {
					char = buff.toString();
					result += char;
					//console.log(start);
					//console.log(result.indexOf("\n"));
					return char;
			});
			console.log(char);
			start++;
		}
		while(start<160);
	});
});
app.listen(3000);
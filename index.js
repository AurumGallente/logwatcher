var express = require('express');
var Sequelize = require("sequelize");
var config = require('./config.js');
var sequelize = new Sequelize(config.db, config.user, config.password, config.config);
var app = express();
var fs = require('fs');
var eolPosition;
var result='';
var myChar='';
var fileName = config.logfile;
var buffer;
var size;
var res;
var opts= {offset:0, length:1,position:0};
var models = require('./models');
models.Record.findAll({limit: 1, order: 'id DESC'}).then(function (records) {    
    position = (!!records[0]) ? parseInt(records[0].dataValues.logIndex) : 0;
    opts.position = (position > 0) ? position : opts.position;
});
fs.watchFile(fileName, function(curr, prev){
    mainCb();
});
function mainCb(){
    fs.stat(fileName, function(err, stats){
        size = stats.size;
    });
    getFuckingString(function(characters){
        result = characters.split('[').join('').replace(/\0/g, '').split("]");
        result[result.length-1] = result[result.length-1].split("]").join('');        
        if(result.length>1){
            models.Record.create({
                date: result[0],
                processid: result[2],
                logIndex: opts.position,
                text: result[4]
            }, {isNewRecord: true}).error(function (err) {            
                console.warn(err.message);
            })
        }
    }, opts);
}
function setChar(nextChar, start, position, cb){
    myChar += nextChar;
    (!!cb) ? cb(myChar) : false;
    opts.position = position;
    myChar='';
}
function getFuckingString(cb, opts){
    fs.open(fileName, 'r', function(status, fd) {
        if (status) {
            console.log(status.message);
            return;
        }
        buffer = new Buffer(10000+opts.position);  
        buffer.fill(0);        
        opts.start = opts.position;        
        while(buffer.toString().indexOf("\r\n")<0 && size>opts.position) {
            fs.readSync(fd, buffer, opts.offset,opts.length,opts.position, function(err, num) {
                console.log(err);
            });
            opts.position++;
            opts.offset++;
        } ;
        fs.closeSync(fd);
        setChar(buffer.toString(), opts.start, opts.position, cb);        
    });
}
setInterval(mainCb, config.interval);
app.get('/', function(req, res) {
        models.Record.findAndCountAll({limit: 300, order: 'id ASC'}).then(function (records) {
            res.json(records);
        });
});
app.listen(config.processPort);
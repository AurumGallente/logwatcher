var bodyParser = require('body-parser');
var corser = require('corser');
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
app.use(bodyParser.json());
// Configure CORS (Cross-Origin Resource Sharing) Headers 
app.use(corser.create({
    methods: corser.simpleMethods.concat(["PUT", "DELETE"]),
    requestHeaders: corser.simpleRequestHeaders.concat(["X-Requested-With", "Authorization"])
}));
app.all('*', function(request, response, next) {    
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Credentials', true);
    response.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With,Authorization,Access-Control-Allow-Origin');
    response.header('Access-Control-Allow-Methods', 'POST,GET,DELETE');
    next();    
});
models.Record.findAll({limit: 1, order: 'id DESC'}).then(function (records) {
        
    position = (!!records[0]) ? parseInt(records[0].dataValues.logIndex) : 0;
    opts.position = (position > 0) ? position : opts.position;
    console.log(opts.position);
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
        buffer = new Buffer(10000);  
        buffer.fill(0);        
        opts.start = opts.position;        
        while(buffer.toString().indexOf("\n")<0 && size>opts.position) {
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
        var page = (req.query.page) ? parseInt(req.query.page) - 1 : 0;
        var perPage = (req.query.perPage && req.query.perPage <= 20) ? parseInt(req.query.perPage) : 5;
        models.Record.findAndCountAll({offset: page * perPage, limit: perPage, order: 'id DESC'}).then(function (records) {
            res.json(records);
        });
});
app.post('/', function(req, res){        
            models.Record.find({where: ["id >= ?", req.body.lr],limit:1, order: 'id DESC'}).then(function(record){ 
                console.log({lastid:record.id}); 
                res.json({lastid:record.id, record:record});
            });               
});
app.listen(config.processPort);

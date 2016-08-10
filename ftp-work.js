var ftpClient = require('ftp'),         //npm install ftp
    fs = require('fs');
    EventEmitter = require('events');
    //stream = require('stream').Writable
    //|| require('readable-stream').Writable;
    //Q = require('q'),                 //npm install q

var log = console.log;                  //Log in console now little simple
var temp = "";

function ftpWorker (path, cb) {
    var client = new ftpClient();
    client.on('ready', function () {
        ftpSpider(client, cb);
    });
    client.connect({
        host: path
    });
};

//Take client you work with and current directory for recursive searching;
function ftpSpider (cl, func, curDir) {
    var donwloads = [],
        dirs = [];
    if (!curDir) var curDir = "/";
    cl.cwd(curDir, function (err) {
        if (err) {
            console.log(curDir, err);
            cl.end();
        };
    });
    cl.list(function (err, list) {
        if (err) {
            throw err;
        };
        for (var i = 0; i < list.length; i++) {
            if (list[i].name.slice(-4).toLowerCase() === '.txt'
                    //MS Excell
                || list[i].name.slice(-5).toLowerCase() === '.xlsx'
                || list[i].name.slice(-4).toLowerCase() === '.xls'
                || list[i].name.slice(-4).toLowerCase() === '.csv'
                || list[i].name.slice(-4).toLowerCase() === '.ods'
                    //MS Word
                || list[i].name.slice(-5).toLowerCase() === '.docx'
                || list[i].name.slice(-4).toLowerCase() === '.doc'
                || list[i].name.slice(-4).toLowerCase() === '.rtf')
            {
                donwloads.push(list[i]);
            } else if (list[i].type === 'd') {
                //if spider find a dir - go deeper ^_^
                dirs.push(list[i]);
            }
        };
    });
    downloads.forEach(function (element, i, arr) {
        cl.get(curDir + element.name, function(err, stream){
            if (err) console.log(err);
            stream.once('close', function () {cl.end();});
            stream.pipe(fs.createWriteStream("./temp/" + element.name));
        });
    });
    dirs.forEach(function (element, i, arr) {
        ftpSpider(cl, func, curDir + element.name + "/");
    });
    cl.end();
}

function copyFileFromFtp (file) {

}

ftpWorker('ftp.startrekftp.ru', log);
//ftpWorker('ftp.sovintel.ru', log);
//ftpWorker('188.134.89.102', log);


var ftpClient = require('ftp'),         //npm install ftp
    fs = require('fs');

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
    if (!curDir) var curDir = "/";
    cl.cwd(curDir, function (err) {
        if (err) {
            console.log(curDir, err);
            return;
            // cl.end();
        };
    });
    cl.list(function (err, list) {
        if (err) {
            throw err;
        };
        for (var i = 0; i < list.length; i++) {
            //do something if type of file is your need
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
                log(curDir + list[i].name)
                promiseGet(cl, curDir + list[i].name)
                    .then(func);
            } else if (list[i].type === 'd') {
                //if spider find a dir - go deeper ^_^
                ftpSpider(cl, func, curDir + list[i].name + "/");
            }
        }
    });
}

// ftpWorker('ftp.startrekftp.ru', DL);
//ftpWorker('ftp.sovintel.ru', log);
ftpWorker('188.134.89.102', log);

function promiseGet (cl, file) {
    return new Promise (function (resolve, reject) {
        cl.get(file, function (err, stream) {
            if (err) reject(err);
            log("gotcha!" + file)
            resolve(stream, file);
        })
    })
}


function DL (stream, name) {
    log(name + " DLing now!")
    stream.pipe(fs.createWriteStream("./temp/" + "test"));
}



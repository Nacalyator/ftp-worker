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
                func(curDir + list[i].name);
            } else if (list[i].type === 'd') {
                //if spider find a dir - go deeper ^_^
                ftpSpider(cl, func, curDir + list[i].name + "/");
            }/* else if (i === list[i].length - 1) {
                //Break loop when spider on last element in dir
                return;
            }*/
        }
    });
    //close client connection
    //log("end");
    // cl.end();
}

function copyFileFromFtp (file) {

}

ftpWorker('ftp.startrekftp.ru', log);
//ftpWorker('ftp.sovintel.ru', log);
//ftpWorker('188.134.89.102', log);


function listAsync (cl) {
    return new Promise(
        function (resolve, reject) {
            cl.list(function (err, list) {
                if (err) reject(err);
                resolve(list);
            })
        }
    )
}



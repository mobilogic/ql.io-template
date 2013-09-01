"use strict";
var prompt = require('../node_modules/prompt'),
    express = require('express'),
    http = require('http'),
    express = require('express');

var Engine = require('../node_modules/ql.io-app/node_modules/ql.io-console/node_modules/ql.io-engine/lib/engine'),
    //Console = require('../node_modules/ql.io-app/node_modules/ql.io-console/app')
    Console = require('../../ql.io-public/modules/console/app')
function doConsole(route, breakpoints, method){
    __dirname = '/Users/greatwall/workspace/ql.io-public/modules/console/test'
    var c = new Console({
        tables : __dirname + '/tables',
        routes : __dirname + '/routes/',
        config : __dirname + '/config/dev.json',
        'enable console' : false,
        connection : 'close'
    }, null, breakpoints);


    c.app.listen(3000, function() {
        var testHttpapp = express();
        testHttpapp.post('/ping/pong', function(req, res) {
            var data = '';
            req.on('data', function(chunk) {
                data += chunk;
            });
            req.on('end', function() {
                res.send(data);
            });
        });

        testHttpapp.listen(80126, function() {
            var options = {
                host : 'localhost',
                port : 3000,
                path : route,
                method : method
                //path : '/del/foo/bar/Details?userid=sallamar&itemid=260852758792',
                //method : 'DELETE'
            };
            var req = http.request(options);
            req.addListener('response', function(resp) {
                var data = '';
                resp.addListener('data', function(chunk) {
                    data += chunk;
                });
                resp.addListener('end', function() {
                    var json = JSON.parse(data);
                    console.log(json)

                    process.exit();

                });
            });
            req.end();
        });
    })
}


//
// Start the prompt
//
function main(){
    prompt.start();

    //
    // Get two properties from the user: username and email
    //

    prompt.get(['path', 'method', 'breakpoints'], function (err, result){
        var breakpoints = result.breakpoints.split(',')
        for (var i = 0; i < breakpoints.length; i++){
            if (!isNaN(breakpoints[i])){
                breakpoints[i] = parseInt(breakpoints[i])
            }
        }
        if (!result.path || !result.method) {
            console.log('Argument missing, please start over again.')
            main()
        } else{
            doConsole(result.path, breakpoints, result.method.toUpperCase())
        }
    })
}
console.log('Welcome to the command line debugger! Please provide the following:')
main()

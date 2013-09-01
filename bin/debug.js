

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

    //__dirname = '/Users/greatwall/workspace/ql.io-template'
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

function directExec(route, breakpoints){
    Engine.executeRoute('GET', route, opts, func)
}
function main1(argv){
    console.log(argv.length)

    if(argv.length != 1){
        console.log('please specify the path of .ql file as the only argument')
        return
    }
    var engine = new Engine();
    console.log('engine')
    var q = 'obj = {"a" : "A", "b" : "B", "c" : "C"}\n\
        foo = select a from obj\n\
        return foo';
    engine.execute(q, {},
        function(emitter) {
            emitter.on('ql.io-debug', function(packet) {
                console.log('break')
                var stdin = process.openStdin();
                require('tty').setRawMode(true);

                stdin.on('keypress', function (chunk, key) {
                    process.stdout.write('Get Chunk: ' + chunk + '\n');
                    if (key){//} && key.ctrl && key.name == 'c') {
                        process.exit();
                        engine.debugData[packet.emitterID].emit('ql.io-debug-step');
                    }
                });
                //engine.debugData[packet.emitterID].emit('ql.io-debug-step');
            });
            emitter.on('end', function(err, results) {
                console.log(results)
            });
        }, true);

}

/*https://github.com/flatiron/prompt
* var sys = require("sys");

 var st = process.openStdin();

 st.addListener("data", function(d) {
 sys.debug("Great input:" + d);
 sys.debug("Now processing...");
 var i = 0;
 function wasteTime() {
 sys.print(".");
 i++;
 // PROCESS INPUT HERE
 if( i > 10 ) {
 sys.puts();
 process.exit(0);
 }
 setTimeout( wasteTime, 500 );
 }
 wasteTime();
 }).addListener("end", function() {
 });

 sys.print("prompt>");*/

function getInput(){
    var buff = '';
    var stdin = process.openStdin();
    process.stdin.setRawMode();
    stdin.on('keypress', function(chunk, key){
        console.log('gogo')
        if(key && key.name == "enter"){
            process.exit();
            console.log('oyeah')
            return buff
        }
        buff+=chunk;
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
/*prompt.get(['breakpoints'], function (err, result) {
    //
    // Log the results.
    //

    console.log('  username: ' + result.breakpoints);
    var breakpoints = result.breakpoints.split(',')
    for (var i = 0; i < breakpoints.length; i++){
        if (!isNaN(breakpoints[i])){
            breakpoints[i] = parseInt(breakpoints[i])
        }
    }
    doConsole(process.argv.splice(2), breakpoints)
});  */
//doConsole(process.argv.splice(2),);
/*
module.exports = {
    'simple': function(test) {
        var q = 'obj = {"a" : "A", "b" : "B", "c" : "C"}\n\
        foo = select a from obj\n\
        return foo';
        engine.execute(q, {},
            function(emitter) {
                var step_num = 0;

                emitter.on('ql.io-debug', function(packet) {
                    switch (step_num){
                        case 0:
                            test.deepEqual(packet.context, {"obj" : {"a" : "A", "b" : "B", "c" : "C"}});
                            break;
                        case 1:
                            test.deepEqual(packet.context, {"obj" : {"a" : "A", "b" : "B", "c" : "C"}, "foo" : ["A"]});
                            break;
                    }
                    step_num++;
                    engine.debugData[packet.emitterID].emit('ql.io-debug-step');
                });
                emitter.on('end', function(err, results) {
                    test.deepEqual(results.body, ['A']);
                    test.done();
                });
            }, true);
    }
};
               */
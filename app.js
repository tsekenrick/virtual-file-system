// app.js
// ======
// bring in dependencies like path, fs, etc.
// express setup goes here
const fs = require('fs');
const path = require('path');
const express = require('express');
const vfs = require('./vfs/FileSystem.js');
const app = express();

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'hbs');

// bring in vfs/FileSystem.js
// let declare a global variable containing the instance of the class
// contained in FileSystem.js

// read init.json with path.join(__dirname, 'vfs', 'init.json')
// in callback:
// 1. parse json with JSON.parse
// 2. instantiate FileSystem object with object created from parsing init.json
// 3. listen on port 3000

let fileSystem;
const initPath = path.join(__dirname, 'vfs', 'init.json');
let osType;
fs.readFile(initPath, (err, data) => {
    if(err) { throw err; }
    fileSystem = new vfs.FileSystem(JSON.parse(data));

    app.get('/', (req, res) => {
        res.render('index');
    });

    app.get('/vfs', (req, res) => {
        if(req.query.name) { osType = req.query.name; }
        const command = req.query.command;
        const option = req.query.option;
        const path = req.query.path === '' ? '/' : req.query.path;
        let result;

        if(command === 'ls') {
            if(option === '-l') {
                const tmp = fileSystem.traverseAndList(path);
                result = tmp[1].reduce((acc, cur, idx) => {
                    acc += cur['permission'] + ' ';
                    acc += cur['owner-name'] + ' ';
                    acc += cur['owner-group'] + ' ';
                    acc += cur['last-modified'] + ' ';
                    acc += tmp[0][idx] + '<br>';
                    return acc;
                }, '');
            } else {
                const tmp = fileSystem.traverseAndList(path);
                result = tmp[0].reduce((acc, cur) => { 
                    acc += cur;
                    acc += '<br>';
                    return acc;
                }, '');
            }
        } else if(command === 'cat') {
            result = fileSystem.cat(path);
        } else if(command === 'tree') {
            let tmp = fileSystem.find(path);
            tmp = fileSystem.treeFind(tmp, [], 0);
            result = tmp.reduce((acc, cur) => { 
                acc += '&emsp;'.repeat(Object.values(cur)[0] * 2);
                acc += Object.keys(cur)[0];
                acc += '<br>';
                return acc;
            }, '');
        }

        res.render('terminal', {"osType": osType, "result": result});
    });

    app.post('/vfs', (req, res) => {
        // if(!osType) { osType = 'debian'; }
        const command = req.body.command;
        const path = req.body.path;
        const content = req.body.content;
        let result;

        if(command === 'mkdir') {
            const tmp = fileSystem.makeDirectory(path, content);
            result = '';
            Object.keys(tmp.files).forEach(element => {
                result += element + '<br>';
            });
        } else if(command === 'write') {
            result = fileSystem.write(path, content);
            result = result === "write: No such file or directory." ? "write: No such file or directory." : '';
        }

        res.render('terminal', {"osType": osType, "result": result});
    });

    app.listen(3000);
});





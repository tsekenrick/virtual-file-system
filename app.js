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
fs.readFile(initPath, (err, data) => {
    if(err) { throw err; }
    fileSystem = new vfs.FileSystem(JSON.parse(data));
    // console.log(fileSystem.traverseAndList('/'));
    app.get('/', (req, res) => {
        res.render('index');
    });

    app.get('/vfs', (req, res) => {
        const osType = (req.query.name);
        res.render('terminal', {"osType": osType});
        // check req.query for os type
    });

    app.post('/vfs', (req, res) => {

        res.redirect('/vfs');
    });

    app.listen(3000);
});





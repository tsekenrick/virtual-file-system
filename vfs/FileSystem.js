
const moment = require('moment');

class FileSystem {
    constructor(obj) {
        this.dir = obj;
    }

    find(path) {
        let metadata = this.dir;
        // if looking in root directory, immediately return
        if (path === '' || path === '/') {
            return metadata['fs']['/'];
        }
        if(path.slice(-1) === '/') { path = path.slice(0, -1); }
        path = path.split('/');
        // add extra elements to get to the root directory
        path.splice(0, 0, '/');
        path.splice(0, 0, 'fs');
        
        path.forEach(element => {
            if (!element) { return; }

            if (metadata.hasOwnProperty(element)) {
                metadata = metadata[element];
            } else {
                metadata = { error: `Could not find file/dir with name ${element}` };
                return;
            }

            // if not the last directory in the path, try to access the files property straight away
            if (path.indexOf(element) !== path.length - 1 && metadata.hasOwnProperty('files')) {
                metadata = metadata['files'];
            }
        });
        return metadata;
    }

    treeFind(pathObj, fileList, recurLevel) {
        if (pathObj.hasOwnProperty('files')) {
            return Object.keys(pathObj['files']).reduce((acc,cur) => {
                const obj = {};
                obj[cur] = recurLevel;
                acc.push(obj);
                if(pathObj['files'][cur].hasOwnProperty('files') && Object.entries(pathObj['files'][cur]).length !== 0) {
                    this.treeFind(pathObj['files'][cur], fileList, recurLevel + 1);
                }
                return acc;
            }, fileList);
        }  
        return fileList;
    }

    traverseAndList(path) {
        const res = this.find(path);

        if (res.hasOwnProperty('files')) {
            const fileList = [];
            Object.keys(res['files']).forEach((fileName) => {
                fileList.push(res['files'][fileName]);
            });
            return [Object.keys(res['files']), fileList];
        }
        return [];
    }

    makeDirectory(path, dirName) {
        const res = this.find(path);
        if (!res.hasOwnProperty('files')) {
            return res;
        } else {
            const objToAdd = {
                'permission': 'drwxr--r--',
                'hard-links': 1,
                'owner-name': 'user',
                'owner-group': 'user',
                'last-modified': moment().format('MMM DD HH:mm'),
                'size': Math.floor(Math.random() * Math.floor(6)),
                'files': {}
            };

            res['files'][dirName] = objToAdd;
            // res['files'][dirName].permission = 'drwxr--r--';
            // res['files'][dirName].hard-links = 1;
            // res['files'][dirName]['owner-name'] = 'user';
            // res['files'][dirName]['owner-group'] = 'user';
            // res['files'][dirName]['last-modified'] = moment().format('MMM DD HH:mm');
            // res['files'][dirName]['size'] = Math.floor(Math.random() * Math.floor(6));
            // res['files'][dirName]['files'] = {};

            return res;
        }
    }

    cat(path) {
        const res = this.find(path);
        if (res.hasOwnProperty('content')) {
            return res['content'];
        } else {
            return "cat: No such file or directory.";
        }
    }

    write(path, content) {
        let pathList = path.split('/');
        const fileName = pathList.pop();
        pathList = pathList.join('/'); // create new path without the final fileName
        const res = this.find(pathList);
        
        // file did not exist originally
        if (!res.hasOwnProperty('files')) {
            return res;      
        // if file existed, overwrite content property
        } else if (res['files'].hasOwnProperty(fileName)) {
            res['files'][fileName]['content'] = content;
            return res;
        } else {
            res['files'][fileName]['permission'] = '-rwxr--r--';
            res['files'][fileName]['hard-links'] = 1;
            res['files'][fileName]['owner-name'] = 'user';
            res['files'][fileName]['owner-group'] = 'user';
            res['files'][fileName]['last-modified'] = moment().format('MMM DD HH:mm');
            res['files'][fileName]['size'] = Math.floor(Math.random() * Math.floor(6));
            res['files'][fileName]['content'] = content;
            return res;
        }   
    }
}

module.exports = {
    FileSystem
};

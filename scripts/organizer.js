const fs = require('fs');
const path = require('path');

const renames = [
  {
    value: /import \* as MariaDb from ['"]mariadb['"](?:;)?/gm,
    replaceValue: "import MariaDb from 'mariadb';",
    need: {
      file: /Database\.mjs$/,
    },
  },
  {
    value: /import \* as sjcl from ['"]sjcl['"](?:;)?/gm,
    replaceValue: "import sjcl from 'sjcl';",
    need: {
      file: /encryption.mjs$/
    }
  },
];

var processArgs = process.argv.splice(2);
switch (processArgs[0]) {
  case 'rename':
    rename();
    break;
  case 'clear':
    clear();
    break;
}

function rename() {
  parseAllDirectories(path.join(__dirname, '../dist'), fs.readdirSync(path.join(__dirname, '../dist')));
}

function clear() {
  deleteFolderRecursive(path.join(__dirname, '../dist'));
  deleteFolderRecursive(path.join(__dirname, '../../Server/resources/drp'));
}

function parseAllDirectories(previousDirectory, directories) {
  directories.forEach((directory) => {
    const newDirectory = path.join(previousDirectory, directory);
    if (fs.lstatSync(newDirectory).isFile() && newDirectory.match(/\.js$/)) {
      let newName = newDirectory.replace(/\.js$/, '.mjs');
      fs.renameSync(newDirectory, newName);
      let data = fs.readFileSync(newName).toString();
      let changed = false;
      for (let renameId in renames) {
        let renameData = renames[renameId];
        if (renameData.need != null && renameData.need.file != null) if (!newName.match(renameData.need.file)) continue;
        data = data.replace(renameData.value, renameData.replaceValue);
        changed = true;
      }
      if (changed) fs.writeFileSync(newName, data);
      return;
    }

    if (fs.lstatSync(newDirectory).isDirectory()) {
      parseAllDirectories(newDirectory, fs.readdirSync(newDirectory));
      return;
    }
  });
}

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file) {
      var curPath = path + '/' + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

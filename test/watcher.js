const fs = require('fs')
const path = require('path');
const spawn = require('child_process').spawn;

function watcher(abspath, filename) {
  const watch = spawn('./watcher.exe', [path.resolve(abspath), filename]);
  watch.stdout.on('data', (data) => {
    const parts = path.parse(data.toString().trim())
    console.log(parts);
    // fs.writeFileSync(path.resolve(parts.dir, 'sasd'), '12345dsf')
    watch.kill()
  });
  watch.stderr.on('data', (data) => {
    console.log(`watch error: ${data.toString()}`);
    watch.kill()
  });
}

watcher('C:/', 'abc.cfg')

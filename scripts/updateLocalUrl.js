const fs = require('fs');

const runtimeFile = './packages/functions/.runtimeconfig.json';
fs.readFile(runtimeFile, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const configData = JSON.parse(data);
  configData.app.base_url = 'localhost:3000';
  fs.writeFileSync(runtimeFile, JSON.stringify(configData));
});

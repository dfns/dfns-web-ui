const fs = require('fs');


const envKeys = Object.keys(process.env);
const envVars = envKeys.map(key => `${key}=${process.env[key]}`).join('\n');
fs.writeFileSync(".env", envVars);


/**
 * Stoplight Prism Mock Server for CampusStay FPT
 * Runs mock API on 0.0.0.0:4010 for both Web (localhost) and Mobile (10.0.2.2 / LAN)
 */
const { spawn } = require('child_process');
const path = require('path');

const openapiPath = path.resolve(__dirname, '../docs/api-contract/openapi.yaml');
console.log('🚀 Đang khởi động CampusStay Mock Server từ:', openapiPath);

const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const args = ['-y', '@stoplight/prism-cli', 'mock', openapiPath, '-p', '4010', '-h', '0.0.0.0', '--cors'];

const prism = spawn(cmd, args, { stdio: 'inherit', shell: true });

prism.on('close', (code) => {
  console.log(`Mock server đã dừng với mã thoát ${code}`);
});

process.on('SIGINT', () => {
  prism.kill('SIGINT');
  process.exit();
});

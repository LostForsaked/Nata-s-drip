import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const backendDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '../backend');
const isWindows = process.platform === 'win32';
const command = isWindows ? 'mvnw.cmd' : './mvnw';
const backend = spawn(command, ['spring-boot:run'], {
  cwd: backendDirectory,
  shell: isWindows,
  stdio: 'inherit',
});

backend.on('error', (error) => {
  console.error(`Could not start the Spring Boot backend: ${error.message}`);
  process.exitCode = 1;
});

backend.on('exit', (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});

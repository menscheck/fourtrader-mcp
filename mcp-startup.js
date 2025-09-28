#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Start the server
const serverPath = join(__dirname, 'build', 'server.js');
const serverProcess = spawn('node', [serverPath], {
    stdio: 'inherit',
    cwd: __dirname
});

serverProcess.on('error', (error) => {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
});

serverProcess.on('exit', (code) => {
    if (code !== 0) {
        console.error(`Server exited with code ${code}`);
    }
    process.exit(code || 0);
});

// Handle shutdown signals
process.on('SIGINT', () => {
    serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
    serverProcess.kill('SIGTERM');
});

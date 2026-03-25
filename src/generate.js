const { spawn } = require('child_process');
const path = require('path');

function generatePptx(analysis, config, outputPath) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '..', 'python', 'generate_pptx.py');
    const proc = spawn('python3', [scriptPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stderr = '';
    proc.stderr.on('data', chunk => { stderr += chunk.toString(); });

    proc.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`PPTX generation failed:\n${stderr}`));
      }
    });

    proc.on('error', err => {
      reject(new Error(`Failed to run Python: ${err.message}`));
    });

    proc.stdin.write(JSON.stringify({ analysis, config, outputPath }));
    proc.stdin.end();
  });
}

module.exports = { generatePptx };

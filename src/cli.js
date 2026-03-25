const fs = require('fs');
const path = require('path');
const { transcribe } = require('./transcribe.js');
const { analyze } = require('./analyze.js');
const { generatePptx } = require('./generate.js');
const { loadConfig } = require('./config.js');

const HELP = `
transcribe-proposal - 會議錄音轉專業提案簡報

Usage:
  transcribe-proposal <audio-file> [options]
  transcribe-proposal --transcript <text-file> [options]

Options:
  --output, -o <path>       輸出 PPTX 路徑 (預設: proposal.pptx)
  --transcript, -t <path>   使用現有逐字稿，跳過轉錄
  --transcribe-only         只轉錄，不分析不產出簡報
  --lang <code>             轉錄語言 (預設: zh)
  --template <path>         自訂範本 JSON
  --model <name>            GPT 模型 (預設: gpt-4o-mini)
  --api-key <key>           OpenAI API Key (或設定 OPENAI_API_KEY 環境變數)
  --help, -h                顯示說明
  --version, -v             顯示版本

Examples:
  npx transcribe-proposal meeting.mp3
  npx transcribe-proposal meeting.mp3 -o my-proposal.pptx --lang en
  npx transcribe-proposal --transcript notes.txt -o proposal.pptx
`.trim();

function parseArgs(argv) {
  const args = { flags: {} };
  let i = 0;
  while (i < argv.length) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      args.flags.help = true;
    } else if (arg === '--version' || arg === '-v') {
      args.flags.version = true;
    } else if (arg === '--transcribe-only') {
      args.flags.transcribeOnly = true;
    } else if ((arg === '--output' || arg === '-o') && argv[i + 1]) {
      args.flags.output = argv[++i];
    } else if ((arg === '--transcript' || arg === '-t') && argv[i + 1]) {
      args.flags.transcript = argv[++i];
    } else if (arg === '--lang' && argv[i + 1]) {
      args.flags.lang = argv[++i];
    } else if (arg === '--template' && argv[i + 1]) {
      args.flags.template = argv[++i];
    } else if (arg === '--model' && argv[i + 1]) {
      args.flags.model = argv[++i];
    } else if (arg === '--api-key' && argv[i + 1]) {
      args.flags.apiKey = argv[++i];
    } else if (!arg.startsWith('-') && !args.input) {
      args.input = arg;
    }
    i++;
  }
  return args;
}

async function checkPython() {
  const { execSync } = require('child_process');
  try {
    execSync('python3 -c "import pptx"', { stdio: 'pipe' });
    return true;
  } catch {
    try {
      execSync('python3 --version', { stdio: 'pipe' });
      console.log('python-pptx not found. Installing...');
      execSync('pip3 install python-pptx', { stdio: 'inherit' });
      return true;
    } catch {
      return false;
    }
  }
}

async function run(argv) {
  const { flags, input } = parseArgs(argv);
  const pkg = require('../package.json');

  if (flags.help) {
    console.log(HELP);
    return;
  }

  if (flags.version) {
    console.log(pkg.version);
    return;
  }

  const apiKey = flags.apiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY is required.\n' +
      'Set it via: export OPENAI_API_KEY=sk-...\n' +
      'Or pass: --api-key sk-...'
    );
  }

  // Determine transcript source
  let transcriptText;
  let transcriptPath;

  if (flags.transcript) {
    // Use existing transcript
    const tp = path.resolve(flags.transcript);
    if (!fs.existsSync(tp)) throw new Error(`Transcript not found: ${tp}`);
    transcriptText = fs.readFileSync(tp, 'utf-8');
    console.log(`Using transcript: ${tp} (${transcriptText.length} chars)`);
  } else if (input) {
    // Transcribe audio file
    const audioPath = path.resolve(input);
    if (!fs.existsSync(audioPath)) throw new Error(`Audio file not found: ${audioPath}`);

    const stat = fs.statSync(audioPath);
    const sizeMB = Math.round(stat.size / 1024 / 1024);
    if (stat.size > 25 * 1024 * 1024) {
      throw new Error(
        `File too large (${sizeMB}MB). Whisper API limit is 25MB.\n` +
        'Compress with: ffmpeg -i input.mp3 -b:a 64k -ar 16000 output.mp3'
      );
    }

    console.log(`Transcribing: ${path.basename(audioPath)} (${sizeMB}MB)`);
    const result = await transcribe(audioPath, apiKey, flags.lang || 'zh');
    transcriptText = result.text;

    const mins = Math.floor(result.duration / 60);
    const secs = Math.round(result.duration % 60);
    console.log(`Transcription complete (${mins}m${secs}s, ${transcriptText.length} chars)`);

    // Save transcript
    transcriptPath = audioPath.replace(/\.[^.]+$/, '.txt');
    fs.writeFileSync(transcriptPath, transcriptText, 'utf-8');
    console.log(`Transcript saved: ${transcriptPath}`);

    if (flags.transcribeOnly) {
      console.log('\nDone (transcribe-only mode).');
      return;
    }
  } else {
    console.log(HELP);
    throw new Error('Please provide an audio file or --transcript path.');
  }

  // Check Python for PPTX generation
  const hasPython = await checkPython();
  if (!hasPython) {
    throw new Error(
      'Python 3 is required for PPTX generation.\n' +
      'Install: https://www.python.org/downloads/\n' +
      'Then: pip3 install python-pptx'
    );
  }

  // Analyze transcript
  const model = flags.model || 'gpt-4o-mini';
  console.log(`\nAnalyzing transcript with ${model}...`);
  const analysis = await analyze(transcriptText, apiKey, model);
  console.log(`Analysis complete: "${analysis.title}"`);

  // Load template config
  const config = loadConfig(flags.template);

  // Generate PPTX
  const outputPath = path.resolve(flags.output || 'proposal.pptx');
  console.log(`\nGenerating PPTX...`);
  await generatePptx(analysis, config, outputPath);
  console.log(`\nDone! Proposal saved: ${outputPath}`);
}

module.exports = { run };

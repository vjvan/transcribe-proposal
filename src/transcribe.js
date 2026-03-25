const fs = require('fs');
const path = require('path');

async function transcribe(audioPath, apiKey, lang = 'zh') {
  const fileBuffer = fs.readFileSync(audioPath);
  const fileName = path.basename(audioPath);

  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer]), fileName);
  formData.append('model', 'whisper-1');
  formData.append('language', lang);
  formData.append('response_format', 'verbose_json');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: formData,
    signal: AbortSignal.timeout(600000), // 10 min timeout
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Whisper API error: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    text: data.text,
    duration: data.duration || 0,
    language: data.language || lang,
  };
}

module.exports = { transcribe };

const fs = require('fs');
const path = require('path');

const DEFAULT_TEMPLATE = path.join(__dirname, '..', 'templates', 'default.json');

function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

function loadConfig(customPath) {
  const defaults = JSON.parse(fs.readFileSync(DEFAULT_TEMPLATE, 'utf-8'));

  if (!customPath) return defaults;

  const customFile = path.resolve(customPath);
  if (!fs.existsSync(customFile)) {
    throw new Error(`Template not found: ${customFile}`);
  }

  const custom = JSON.parse(fs.readFileSync(customFile, 'utf-8'));
  return deepMerge(defaults, custom);
}

module.exports = { loadConfig };

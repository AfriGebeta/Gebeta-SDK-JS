import path from 'path';
import fs from 'fs';

export interface IntegrationConfig {
  apiKey: string;
}

export function loadIntegrationConfig(): IntegrationConfig {
  const configPath = path.join(__dirname, '../../config.js');
  if (!fs.existsSync(configPath)) {
    throw new Error(
      `Integration test config file not found at ${configPath}. ` +
        'Please copy config.example.js to config.js and add your API key.'
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const config = require(configPath) as IntegrationConfig;
  if (!config.apiKey || config.apiKey === 'your-api-key-here') {
    throw new Error('Please set a valid API key in config.js');
  }
  return config;
}

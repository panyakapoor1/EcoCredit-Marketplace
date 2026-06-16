require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const env = {
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  groqKey: process.env.GROQ_API_KEY,
  rpcUrl: process.env.RPC_URL,
  privateKey: process.env.PRIVATE_KEY,
  contractAddress: process.env.CONTRACT_ADDRESS,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  isProd: process.env.NODE_ENV === 'production',
};

// only enforce in non-test environments
if (process.env.NODE_ENV !== 'test') {
  const required = ['jwtSecret', 'jwtRefreshSecret'];
  for (const key of required) {
    if (!env[key]) {
      console.error(`Missing required env var: ${key}`);
      process.exit(1);
    }
  }
}

module.exports = env;

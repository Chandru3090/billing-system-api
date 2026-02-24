const config = Object.freeze({
    port: process.env.PORT || 5000,
    // Keep MONGODB_URI null when not set explicitly to avoid accidentally talking to localhost
    databaseURI: process.env.MONGODB_URI || null,
    // Allow using a local DB by explicitly setting ALLOW_LOCAL_DB=true in dev/testing
    allowLocalDb: (process.env.ALLOW_LOCAL_DB || (process.env.NODE_ENV === 'development' ? 'true' : 'false')) === 'true',
    nodeEnv: process.env.NODE_ENV || 'development',
    accessTokenSecret:
        process.env.ACCESS_TOKEN_SECRET ||
        '',
});

console.log(`Configuration loaded: databaseURI=${config.databaseURI}, PORT=${config.port}`);

module.exports = config;

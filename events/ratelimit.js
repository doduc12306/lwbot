module.exports = (client, rateLimitInfo) => {
  client.logger.error('Ratelimited!');
  console.error(rateLimitInfo);
  client.logger.error('Process will shut down now.');
  process.exit(1);
};
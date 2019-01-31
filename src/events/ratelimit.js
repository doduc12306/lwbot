module.exports = (client, rateLimitInfo) => {
  client.logger.error('Ratelimited!');
  console.error(rateLimitInfo);
  client.logger.error('Process will shut down now.');
  if(process.env._pm2_version) return require('child_process').exec('pm2 stop LWBot');
  else process.exit(1);
};
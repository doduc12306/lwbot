clear;
npm i chalk dbans discord.js enmap enmap-level giphy-api moment pm2 sequelize sqlite3 urban-dictionary utf8;
echo " ";
echo " ";
echo "-------------- STARTING PM2 DAEMON --------------";
echo " ";
echo " ";
pm2 start index.js --attach;
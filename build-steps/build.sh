# The build process
clear;
npm i chalk dbans discord.js enmap enmap-level giphy-api moment pm2 sequelize sqlite3 urban-dictionary utf8;
echo " ";
echo " ";
echo "-------------- Starting -------------";
echo " ";
echo " ";
pm2 start index.js;

sleep 60;

pm2 stop index.js;
bash ./run.sh;
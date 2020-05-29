const Sequelize = require('sequelize');
const { Guild, Role } = require('discord.js');
const logger = require('../../util/Logger');
const { client } = require('../../startup');

// SAR = Self Assignable Roles
class GuildSAR {
  constructor(guildID) {
    if (!guildID) throw new Error('Missing guild ID');
    if (guildID instanceof Guild) {
      logger.warn('Passed guild object when it was supposed to be the ID. Converting now...');
      guildID = guildID.id;
    }
    if (!client.guilds.cache.get(guildID)) throw new Error('Guild does not exist to get');

    this.guildID = guildID;
    this.guildObject = client.guilds.cache.get(guildID);
  }

  /**
   * The database that controls all of the guild things
   * @returns Sequelize Database
   */
  get database() {
    return new Sequelize('database', 'username', 'password', {
      host: 'localhost',
      dialect: 'sqlite',
      logging: false,
      storage: `databases/servers/${this.guildID}.sqlite`,
      transactionType: 'IMMEDIATE'
    });
  }

  /**
   * The table that contains the self-assignable roles for the guild
   * @returns Sequelize Table
   */
  get table() {
    return this.database.define('sar', {
      roleID: { type: Sequelize.STRING, allowNull: false, unique: true }
    }, { timestamps: false, freezeTableName: true });
  }

  shortcut() {
    if(!this.guildObject.syncedDBs) {
      this.guildObject.syncedDBs = { sar: true };
      this.table.sync();
    } else if (!this.guildObject.syncedDBs.sar) {
      this.guildObject.syncedDBs.sar = true;
      this.table.sync();
    }

    return this.table;
  }

  /**
   * Get all of the current self-assignable roles in this guild
   * @returns {Array<String>} An array of IDs
   */
  get sarRoles() {
    return new Promise((resolve, reject) => {
      return this.shortcut().findAll().then(roles => {
        if (!roles) return reject(null);

        const roleArray = [];
        for (const role of roles) roleArray.push(role.roleID);

        return resolve(roleArray);
      });
    });
  }

  /**
   * Add a role to the SAR table
   * @param {String} roleID
   * @returns {String} The role ID 
   */
  addRole(roleID) {
    return new Promise((resolve, reject) => {
      if (!roleID) return reject(new Error('Missing role ID to add'));
      if (roleID instanceof Role) {
        logger.warn('Converting Role object to role ID');
        roleID = roleID.id;
      }

      if (!this.guildObject.roles.cache.get(roleID)) return reject(new Error('Role does not exist in this guild'));

      return this.shortcut().create({ roleID })
        .then(newRole => {
          return resolve(newRole.roleID);
        }).catch(e => {
          if(e.name === 'SequelizeUniqueConstraintError') return reject(new Error('Role already exists'));
          else reject(e);
        });
    });
  }

  /**
   * Delete a role from the SAR table
   * @param {String} roleID 
   * @returns {Boolean} true if the database deleted successfully
   */
  deleteRole(roleID) {
    return new Promise((resolve, reject) => {
      if (!roleID) return reject(new Error('Missing role ID to add'));
      if (roleID instanceof Role) {
        logger.warn('Converting Role object to role ID');
        roleID = roleID.id;
      }

      if (!this.guildObject.roles.cache.get(roleID)) return reject(new Error('Role does not exist in this guild'));

      return this.shortcut().destroy({ where: { roleID } })
        .then(res => {
          if(res === 0) return reject(new Error('Role did not exist'));
          else return resolve(true);
        }).catch(reject);
    });
  }
}

module.exports = GuildSAR;
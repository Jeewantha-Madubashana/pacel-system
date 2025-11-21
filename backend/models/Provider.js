import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Provider = sequelize.define('Provider', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  skills: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  availability: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'providers',
  timestamps: false,
});

Provider.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default Provider;


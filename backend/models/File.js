import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Booking from './Booking.js';

const File = sequelize.define('File', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  booking_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Booking,
      key: 'id',
    },
  },
  file_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('image', 'document'),
    defaultValue: 'image',
  },
}, {
  tableName: 'files',
  timestamps: false,
});

File.belongsTo(Booking, { foreignKey: 'booking_id' });

export default File;


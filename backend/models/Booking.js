import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Service from './Service.js';

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  provider_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
  },
  service_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Service,
      key: 'id',
    },
  },
  pickup_lat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
  },
  pickup_lng: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
  },
  pickup_address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  drop_lat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
  },
  drop_lng: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
  },
  drop_address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'on_the_way', 'started', 'delivered', 'handover', 'completed', 'rejected'),
    defaultValue: 'pending',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'bookings',
  timestamps: false,
});

Booking.belongsTo(User, { foreignKey: 'customer_id', as: 'customer' });
Booking.belongsTo(User, { foreignKey: 'provider_id', as: 'provider' });
Booking.belongsTo(Service, { foreignKey: 'service_id' });
// Booking.hasMany(File) association is defined in server.js to avoid circular dependency

export default Booking;


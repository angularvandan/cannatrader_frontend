import { DataTypes, Model, Optional } from 'sequelize';
import { db } from '../../config/database';

interface CompanyAttributes {
  id: string;
  userId: string;
  company_name: string;
  business_type: string;
  contact_no: string;
  business_id_no: string;
  health_license: string;
  business_location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

interface CompanyCreationAttributes extends Optional<CompanyAttributes, 'id'> { }

class Company extends Model<CompanyAttributes, CompanyCreationAttributes> implements CompanyAttributes {
  public id!: string;
  public userId!: string;
  public company_name!: string;
  public business_type!: string;
  public contact_no!: string;
  public business_id_no!: string;
  public health_license!: string;
  public business_location!: { type: 'Point'; coordinates: [number, number] };
}

Company.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: {  // Define userId in the model
    type: DataTypes.UUID,
    allowNull: false,
  },
  company_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  business_type: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  contact_no: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  business_id_no: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  health_license: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Health license is required' },
      notEmpty: { msg: 'Health license is required' },
    },
  },
  business_location: {
    type: DataTypes.GEOMETRY('POINT', 4326),
    allowNull: false,
  },
}, {
  sequelize: db,
  tableName: 'companies',
  timestamps: true, // Set to true if you want createdAt and updatedAt fields
});

export default Company;

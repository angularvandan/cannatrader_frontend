import { DataTypes, Model } from "sequelize";
import { db } from "../../config/database";

const Address = db.define(
  "Address",
  {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id',
      }
    },
    street: {
      type: DataTypes.STRING(255)
    },
    city: {
      type: DataTypes.STRING(255)
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    zip_code: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  },
  {
    modelName: 'Address',
    tableName: 'addresses',
    timestamps: false
  }
);

Address.sync();

export default Address;

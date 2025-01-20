import { Model, DataTypes } from 'sequelize';
import { db } from "../../config/database";  // Adjust the path to your configuration file

class Wishlist extends Model {
  public userId!: string;
  public productId!: string;
  public is_wishlisted!: boolean;
}

Wishlist.init({
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  is_wishlisted: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  sequelize: db,
  tableName: 'wishlists',
  timestamps: true,
});

export default Wishlist;

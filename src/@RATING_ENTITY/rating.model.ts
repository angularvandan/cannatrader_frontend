// models/ProductRating.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { db } from '../../config/database';

interface ProductRatingAttributes {
    id: string;
    productId: string;
    userId: string;
    rating: number; // Rating between 1 and 5
}

interface ProductRatingCreationAttributes extends Optional<ProductRatingAttributes, 'id'> { }

class ProductRating extends Model<ProductRatingAttributes, ProductRatingCreationAttributes> implements ProductRatingAttributes {
    public id!: string;
    public productId!: string;
    public userId!: string;
    public rating!: number;
}

ProductRating.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    }
}, {
    sequelize: db,
    tableName: 'product_ratings',
    timestamps: true,
});

export default ProductRating;

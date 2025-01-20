import { DataTypes, Model, Optional } from 'sequelize';
import { db } from '../../config/database';

interface SubscriptionAttributes {
    id: string;
    userId: string;
    companyId: string;
}

interface SubscriptionCreationAttributes extends Optional<SubscriptionAttributes, 'id'> { }

class Subscription extends Model<SubscriptionAttributes, SubscriptionCreationAttributes> implements SubscriptionAttributes {
    public id!: string;
    public userId!: string;
    public companyId!: string;
}

Subscription.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    companyId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
}, {
    sequelize: db,
    tableName: 'subscriptions',
    timestamps: true, // To handle createdAt and updatedAt fields
});

export default Subscription;

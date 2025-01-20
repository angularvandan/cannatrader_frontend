import { DataTypes, Model } from 'sequelize';
import { db } from '../../config/database';

class Notification extends Model {
    public id!: string;
    public title!: string;
    public message!: string;
    public image!: string;
    public userId!: string;
    public isRead!: boolean;
    public redirectUrl!: string; // URL or route to redirect to when clicked
}

// Initialize the Notification model
Notification.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING, // URL to the notification image
        allowNull: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    redirectUrl: {
        type: DataTypes.STRING,
        allowNull: true, // URL or route to redirect to when clicked
    },
    allRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize: db,
    tableName: 'notifications',
    timestamps: true,
});

export { Notification };
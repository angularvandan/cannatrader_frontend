import { DataTypes, Model } from "sequelize";
import { db } from "../../config/database";

const ChatStatus = db.define(
    "ChatStatus",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        last_user_id: {
            type: DataTypes.UUID,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        next_user_id: {
            type: DataTypes.UUID,
            references: {
                model: 'users',
                key: 'id',
            },
        },
    },
    {
        modelName: 'ChatStatus',
        tableName: 'ChatStatuses',
        timestamps: false,
    }
);

export default ChatStatus;

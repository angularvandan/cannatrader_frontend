import { DataTypes, Model, Optional } from 'sequelize';
import { db } from '../../config/database';
import { EnumType } from 'typescript';

class Content extends Model {
    public id!: string;
    public title!: "TERMS_AND_CONDITIONS" | "PRIVACY_POLICY";
    public desc!: string;
}

// Initialize the Chat model
Content.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Use UUIDV4 to generate UUID
        primaryKey: true,
    },
    title: {
        type: DataTypes.ENUM("TERMS_AND_CONDITIONS", "PRIVACY_POLICY"),
        allowNull: false
    },
    desc: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize: db,
    tableName: 'content',
    timestamps: true,
});

class Query extends Model {
    public id!: string;
    public name!: string;
    public email!: string;
    public phone_no!: number;
    public message!: string;
    public response!: string | null; // New field for admin response
    public isNotified!: boolean; // To track if the user has been notified
}

// Initialize the Query model
Query.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Use UUIDV4 to generate UUID
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Name is required" },
            notEmpty: { msg: "Name is required" },
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: { msg: "Invalid Email" },
            notNull: { msg: "Email is required" },
            notEmpty: { msg: "Email is required" },
        }
    },
    phone_no: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
            isNumeric: true,
            notNull: { msg: "Phone is required" },
            notEmpty: { msg: "Phone is required" }
        }
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: { msg: "Message is required" },
            notEmpty: { msg: "Message is required" }
        }
    },
    response: {
        type: DataTypes.TEXT,
        allowNull: true, // Admin response can be initially null
    },
    isNotified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    sequelize: db,
    tableName: 'queries',
    timestamps: true,
});


export { Content, Query };

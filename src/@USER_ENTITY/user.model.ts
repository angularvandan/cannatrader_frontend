import { DataTypes, Model, Optional } from "sequelize";
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing
import { db } from "../../config/database";  // Adjust the path to your configuration file
import jwt from 'jsonwebtoken';  // Import jwt for token generation

// Define the user types enum
enum UserType {
    ADMIN = 'admin',
    USER = 'user',
    VENDOR = 'vendor'
}

const random_profile = () => {
    const img_urls = [
        "https://cdn2.iconfinder.com/data/icons/avatars-60/5985/2-Boy-512.png",
        "https://cdn2.iconfinder.com/data/icons/avatars-60/5985/4-Writer-1024.png",
        "https://cdn2.iconfinder.com/data/icons/avatars-60/5985/40-School_boy-512.png",
        "https://cdn2.iconfinder.com/data/icons/avatars-60/5985/12-Delivery_Man-128.png",
        "https://cdn1.iconfinder.com/data/icons/user-pictures/100/boy-512.png",
    ];

    const idx = Math.floor(Math.random() * img_urls.length);
    return img_urls[idx];
};

const validateEmail = (email: string) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

// Define the UserAttributes interface
interface UserAttributes {
    id: string;
    name: string;
    email: string;
    phone_no: number;
    password: string;
    avatar?: string;
    role: UserType;
    is_verified?: boolean
    is_company?: boolean
    is_active?: boolean
}

// Define the UserCreationAttributes interface
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

// Define the User model
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public name!: string;
    public email!: string;
    public phone_no!: number;
    public avatar?: string;
    public password!: string;
    public role!: UserType;
    public is_verified?: boolean
    public is_company!: boolean
    public is_active!: boolean

    public async getJWTToken(): Promise<string> {
        return jwt.sign({ userId: this.id }, process.env.JWT_SECRET as string, {
            expiresIn: process.env.JWT_TOKEN_EXPIRE,
        });
    }

    public toJSON(): Partial<UserAttributes> {
        const values: Partial<UserAttributes> = Object.assign({}, this.get());
        delete values.password;
        return values;
    }

    public static getUpdateFields(userData: Partial<UserAttributes>) {
        const attributes = Object.keys(User.getAttributes());
        const defaultFields = [
            "id",
            "createdAt",
            "updatedAt",
            "password",
            "role",
        ];
        const updateFields = attributes.filter(
            (attribute) => !defaultFields.includes(attribute)
        );

        return Object.fromEntries(
            Object.entries(userData).filter(([key]) =>
                updateFields.includes(key)
            )
        );
    }

}

// Initialize the User model
User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Username is required" },
            notEmpty: { msg: "Username is required" },
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: "Invalid Email"
            },
            notNull: { msg: "Email is required" },
            notEmpty: { msg: "Email is required" },
            async isUnique(value: string) {
                const existingUser = await User.findOne({
                    where: {
                        email: value,
                        is_verified: true
                    },
                });
                if (existingUser) {
                    throw new Error("Email already in use!");
                }
            },
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
    avatar: {
        type: DataTypes.STRING,
        defaultValue: random_profile(),
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8, 255],
                msg: "Password must be at least 8 characters long"
            },
        }
    },
    role: {
        type: DataTypes.ENUM('user', 'admin', 'provider'),
        allowNull: false
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    is_company: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
}, {
    sequelize: db,
    tableName: 'users',
    paranoid: true,
    timestamps: true,  // created_at is handled by sequelize
    defaultScope: {
        attributes: { exclude: ["password"] },
    },
    hooks: {
        beforeSave: async (user: User, options: any) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

User.addScope('withPassword', {
    attributes: { include: ['password'] },
});


// Define the OTP attributes interface
interface OtpAttributes {
    id: string;
    otp: number;
    userId: string;
    createdAt?: Date;  // This will be used for OTP validation
}

// Define the OTP creation attributes interface
interface OtpCreationAttributes extends Optional<OtpAttributes, 'id'> { }

// Define the Otp model
class Otp extends Model<OtpAttributes, OtpCreationAttributes> implements OtpAttributes {
    public id!: string;
    public otp!: number;
    public userId!: string;
    public readonly createdAt!: Date;  // Read-only attribute managed by Sequelize

    public async isValid(givenOTP: number): Promise<boolean> {
        const otpValidityDuration = 2 * 60 * 1000;  // 2 minutes
        const currentTime = new Date().getTime();  // Current time in milliseconds
        const otpCreationTime = this.createdAt.getTime();  // OTP creation time in milliseconds

        // Calculate the time difference between current time and OTP creation time
        const timeDifference = currentTime - otpCreationTime;

        // Debugging logs
        console.log("Current time:", new Date());
        console.log("OTP creation time:", new Date(otpCreationTime));
        console.log("Time difference:", timeDifference);
        console.log("OTP validity duration:", otpValidityDuration);
        console.log("Given OTP:", givenOTP, "Type:", typeof givenOTP);
        console.log("Stored OTP:", this.otp, "Type:", typeof this.otp);

        // Ensure givenOTP and stored OTP are of the same type
        const storedOTP = Number(this.otp);  // Convert stored OTP to number if needed

        // Check if the time difference is within the OTP validity duration
        if (timeDifference <= otpValidityDuration) {
            console.log("OTP is within the validity duration.");
            // Check if the given OTP matches the stored OTP
            if (storedOTP == givenOTP) {
                console.log("OTP matches.");
                return true;
            } else {
                console.log("OTP does not match.");
                return false;
            }
        } else {
            console.log("OTP has expired.");
            return false;
        }
    }

}

// Initialize the Otp model
Otp.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    otp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: "OTP cannot be null." },
            notEmpty: { msg: "OTP cannot be empty." },
        },

    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    sequelize: db,
    tableName: 'otp',
    timestamps: true
});

User.hasOne(Otp, {
    foreignKey: 'userId',
    as: 'otp'
});
Otp.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// Export the model and the enum
export { User, UserType, UserAttributes, Otp };

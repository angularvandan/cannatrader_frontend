// Import Sequelize library and connection
import { DataTypes, Model, Optional } from "sequelize";
import { db } from "../../config/database";

// Define an interface for the attributes
interface ProductAttributes {
    id: string;
    user_id: string;
    name: string;
    thc_range: string,
    category: string,
    sub_category: string,
    strain_type: string;
    lineage: string;
    harvest_date: Date;
    thc_total: number;
    cbd: number;
    terpene: number;
    available: string;
    grade: string;
    growth_method: string;
    grow_media: string;
    dry_method: string;
    trim_method: string;
    irradiated: boolean;
    bud_size: string;
    tops: number;
    mids: number;
    lowers: number;
    location: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    };
    description: string;
    coa_document?: string;
    images: object; // Assuming JSON is stored as an object
    rating?: number;
    created_at?: Date;
    updated_at?: Date;
}

// Define an interface for creation attributes
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'coa_document' | 'rating' | 'created_at' | 'updated_at'> { }

// Define the Product model
class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public id!: string;
    public user_id!: string;
    public name!: string;
    public strain_type!: string;
    public thc_range!: string;
    public category!: string;
    public sub_category!: string;
    public lineage!: string;
    public harvest_date!: Date;
    public thc_total!: number;
    public cbd!: number;
    public terpene!: number;
    public available!: string;
    public grade!: string;
    public growth_method!: string;
    public grow_media!: string;
    public dry_method!: string;
    public trim_method!: string;
    public irradiated!: boolean;
    public bud_size!: string;
    public tops!: number;
    public mids!: number;
    public lowers!: number;
    public location!: { type: 'Point'; coordinates: [number, number] };
    public description!: string;
    public coa_document?: string;
    public images!: object;
    public rating?: number;

    // Timestamps
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

Product.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        strain_type: {
            type: DataTypes.UUID,
            allowNull: false
        },
        thc_range: {
            type: DataTypes.UUID,
            allowNull: false
        },
        category: {
            type: DataTypes.UUID,
            allowNull: false
        },
        sub_category: {
            type: DataTypes.UUID,
            allowNull: true
        },
        lineage: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        harvest_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        thc_total: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        cbd: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        terpene: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        available: {
            type: DataTypes.STRING,
            allowNull: false
        },
        grade: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        growth_method: {
            type: DataTypes.UUID,
            allowNull: false
        },
        grow_media: {
            type: DataTypes.UUID,
            allowNull: false
        },
        dry_method: {
            type: DataTypes.UUID,
            allowNull: false
        },
        trim_method: {
            type: DataTypes.UUID,
            allowNull: false
        },
        irradiated: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        bud_size: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        tops: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        mids: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        lowers: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        location: {
            type: DataTypes.GEOMETRY('POINT', 4326),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        coa_document: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        images: {
            type: DataTypes.JSON,
            allowNull: false
        },
        rating: {
            type: DataTypes.FLOAT
        }
    },
    {
        sequelize: db,
        tableName: 'products',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

export default Product;

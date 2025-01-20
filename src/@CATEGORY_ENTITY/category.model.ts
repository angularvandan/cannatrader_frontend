import { DataTypes, Model } from 'sequelize';
import { db } from '../../config/database'; // Adjust this import to your project structure

class Category extends Model {
    public id!: string;
    public name!: string;
    public created_at!: Date;
    public updated_at!: Date;
}

Category.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize: db,
        tableName: 'categories',
        timestamps: true,
    }
);

class SubCategory extends Model {
    public id!: string;
    public name!: string;
    public category_id!: string;
    public created_at!: Date;
    public updated_at!: Date;
}

SubCategory.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category_id: {
            type: DataTypes.UUID,
            allowNull: false
        }
    },
    {
        sequelize: db,
        tableName: 'sub_categories',
        timestamps: true,
    }
);

class THC extends Model {
    public id!: string;
    public range!: string;
    public created_at!: Date;
    public updated_at!: Date;
}

THC.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        range: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize: db,
        tableName: 'thc_ranges',
        timestamps: true,
    }
);

// StrainType Model
class StrainType extends Model {
    public id!: string;
    public type!: string;
    public created_at!: Date;
    public updated_at!: Date;
}

StrainType.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize: db,
        tableName: 'strain_types',
        timestamps: true,
    }
);

// GrowMedia Model
class GrowMedia extends Model {
    public id!: string;
    public media!: string;
    public created_at!: Date;
    public updated_at!: Date;
}

GrowMedia.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        media: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize: db,
        tableName: 'grow_media',
        timestamps: true,
    }
);

// GrowthMethod Model
class GrowthMethod extends Model {
    public id!: string;
    public method!: string;
    public created_at!: Date;
    public updated_at!: Date;
}

GrowthMethod.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        method: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize: db,
        tableName: 'growth_methods',
        timestamps: true,
    }
);

// TrimMethod Model
class TrimMethod extends Model {
    public id!: string;
    public method!: string;
    public created_at!: Date;
    public updated_at!: Date;
}

TrimMethod.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        method: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize: db,
        tableName: 'trim_methods',
        timestamps: true,
    }
);

// DryMethod Model
class DryMethod extends Model {
    public id!: string;
    public method!: string;
    public created_at!: Date;
    public updated_at!: Date;
}

DryMethod.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        method: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize: db,
        tableName: 'dry_methods',
        timestamps: true,
    }
);

export { Category, SubCategory, THC, StrainType, GrowMedia, GrowthMethod, TrimMethod, DryMethod };

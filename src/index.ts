import { User, userRouter } from "./@USER_ENTITY/user.index";
import { Company, companyRouter } from "./@COMPANY_ENTITY/company.index"
import { adminRouter } from "./@ADMIN_ENTITY/admin.intex";
import { Product, productRouter } from "./@PRODUCT_ENTITY/product.index"
import { Wishlist, wishlistRouter } from "./@WISHLIST_ENTITY/wishlist.index";
import { Subscription, subscribeRouter } from "./@SUBSCRIBE_ENTITY/subscribe.index"
import { Category, DryMethod, GrowMedia, GrowthMethod, StrainType, SubCategory, THC, TrimMethod, categoryRouter } from "./@CATEGORY_ENTITY/category.index";
import { UserType } from "./@USER_ENTITY/user.model";
import { ProductRating, ratingRouter } from "./@RATING_ENTITY/rating.index";
import { chatRouter } from "./@CHATS_ENTITY/chats.index"
import { contentRouter } from "./@CONTENT_ENTITY/content.index";
import { notificationRouter, Notification } from "./@NOTIFICATION_ENTITY/notification.index";
User.hasOne(Company, {
    foreignKey: 'userId',
    as: 'company'
});
Company.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

Product.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'vendor'
});
User.hasMany(Product, {
    foreignKey: 'user_id',
    as: 'products'
});

User.hasMany(Wishlist, {
    foreignKey: 'userId',
    as: 'wishlists'
});

Wishlist.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

Product.hasMany(Wishlist, {
    foreignKey: 'productId',
    as: 'wishlists'
});

Category.hasMany(SubCategory, {
    foreignKey: 'category_id',
    as: 'subCategories'
});
SubCategory.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category'
});

// A SubCategory can be associated with many Products
SubCategory.hasMany(Product, {
    foreignKey: 'sub_category',
    as: 'products'
});

Product.belongsTo(SubCategory, {
    foreignKey: 'sub_category',
    as: 'subCategory'
});

// A Category can have many Products
Category.hasMany(Product, {
    foreignKey: 'category',
    as: 'products'
});

Product.belongsTo(Category, {
    foreignKey: 'category',
    as: 'categories'
});

// Subscribtion
User.hasMany(Subscription, { foreignKey: 'userId' });
Subscription.belongsTo(User, { foreignKey: 'userId' });

Company.hasMany(Subscription, { foreignKey: 'companyId' });
Subscription.belongsTo(Company, { foreignKey: 'companyId' });

// Category, SubCategory
THC.hasMany(Product, { foreignKey: 'thc_range', as: 'products' });
StrainType.hasMany(Product, { foreignKey: 'strain_type', as: 'products' });
GrowMedia.hasMany(Product, { foreignKey: 'grow_media', as: 'products' });
GrowthMethod.hasMany(Product, { foreignKey: 'growth_method', as: 'products' });
TrimMethod.hasMany(Product, { foreignKey: 'trim_method', as: 'products' });
DryMethod.hasMany(Product, { foreignKey: 'dry_method', as: 'products' });

Product.belongsTo(THC, { foreignKey: 'thc_range', as: 'thc_ranges' });
Product.belongsTo(StrainType, { foreignKey: 'strain_type', as: 'strain_types' });
Product.belongsTo(GrowMedia, { foreignKey: 'grow_media', as: 'grow_medias' });
Product.belongsTo(GrowthMethod, { foreignKey: 'growth_method', as: 'growth_methods' });
Product.belongsTo(TrimMethod, { foreignKey: 'trim_method', as: 'trim_methods' });
Product.belongsTo(DryMethod, { foreignKey: 'dry_method', as: 'dry_methods' });

//Wishlist
Wishlist.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product'
});

//Rating
ProductRating.hasMany(Product, { foreignKey: 'ratings', as: 'products' });
Product.belongsTo(ProductRating, { foreignKey: 'ratings', as: 'prating' })

const categoriesWithSubCategories = [
    {
        name: 'Flower',
        subCategories: []
    },
    {
        name: 'Bio Mass',
        subCategories: []
    },
    {
        name: 'Hemp',
        subCategories: []
    },
    {
        name: 'Fresh Frozen',
        subCategories: []
    },
    {
        name: 'Genetics',
        subCategories: ['Clones', 'Teens', 'Mothers', 'Seeds']
    },
    {
        name: 'Extracts-Concentrates',
        subCategories: ['Distilate', 'Isolate', 'Shatter', 'Butter', 'Badder', 'Wax', 'Hash', 'Crumble', 'Diamonds', 'Infused']
    },
    {
        name: 'Edibles',
        subCategories: ['Gummies', 'Chocolate', 'Baked Goods', 'Beverage', 'Tincture', 'Syringe']
    },
    {
        name: 'Topicals',
        subCategories: ['Cream']
    },
    {
        name: 'Services',
        subCategories: ['Processing', 'Co Pack', 'Pre rolls', 'Vape Carts', 'Pouch Jars', 'Bubble Hash', 'Dry', 'Trim', 'Test', 'Mill', 'Irridation']
    },
    {
        name: 'Materials',
        subCategories: []
    },
    {
        name: 'Equipment',
        subCategories: []
    },
];

const thcRanges = [
    { range: '0-10%' },
    { range: '10-20%' },
    { range: '20-30%' },
    { range: '30% Plus' },
];

const strainTypes = [
    { type: 'Indica' },
    { type: 'Sativa' },
    { type: 'Hybrid' },
];

const growMedia = [
    { media: 'Coco' },
    { media: 'Soiless Mix' },
    { media: 'Perlite' },
    { media: 'Vermiculite' },
    { media: 'Hydroponic' },
];

const growthMethods = [
    { method: 'Standard' },
    { method: 'Micro' },
    { method: 'Indoor' },
    { method: 'Outdoor' },
    { method: 'Greenhouse' },
];

const trimMethods = [
    { method: 'Machine' },
    { method: 'Hand' },
    { method: 'Machine-Hand' },
    { method: 'Not Trimmed' },
];

const dryMethods = [
    { method: 'Hang' },
    { method: 'Tray' },
];

async function createCategoriesAndSubCategories() {
    try {
        // Loop through each category and create it
        for (const categoryData of categoriesWithSubCategories) {
            const category = await Category.create({ name: categoryData.name });

            // Create subcategories for the current category
            for (const subCategoryName of categoryData.subCategories) {
                await SubCategory.create({
                    name: subCategoryName,
                    category_id: category.id
                });
            }
        }

        await Promise.all([
            THC.bulkCreate(thcRanges),
            StrainType.bulkCreate(strainTypes),
            GrowMedia.bulkCreate(growMedia),
            GrowthMethod.bulkCreate(growthMethods),
            TrimMethod.bulkCreate(trimMethods),
            DryMethod.bulkCreate(dryMethods),
        ]);



        console.log('Categories and subcategories created successfully!');
    } catch (error) {
        console.error('Error creating categories and subcategories:', error);
    }
}

async function createAdmin() {
    const admin = await User.create({
        email: "admin@cannatrader.com",
        password: "password",
        name: "Admin",
        phone_no: 1234567891,
        is_verified: true,
        role: UserType.ADMIN,
        avatar: "https://cdn2.iconfinder.com/data/icons/avatars-60/5985/2-Boy-512.png"
    });
}

// Create Admin
// createAdmin()

// Run the script
// createCategoriesAndSubCategories();

export { User, Company, Product, companyRouter, userRouter, productRouter, wishlistRouter, categoryRouter, adminRouter, subscribeRouter, ratingRouter, chatRouter, contentRouter, notificationRouter }
import { StatusCodes } from "http-status-codes";
import { Category, DryMethod, GrowMedia, GrowthMethod, StrainType, SubCategory, THC, TrimMethod } from "./category.model";
import ErrorHandler from "../../utils/errorHandler";
import catchAsyncError from "../../utils/catchAsyncError";

export const getCategories = catchAsyncError(async (req: any, res: any, next: any) => {
    const categories = await Category.findAll();
    res.status(StatusCodes.OK).json({ success: true, data: categories });
});
export const getTHCrange = catchAsyncError(async (req: any, res: any, next: any) => {
    const categories = await THC.findAll();
    res.status(StatusCodes.OK).json({ success: true, data: categories });
});
export const getStrainTypes = catchAsyncError(async (req: any, res: any, next: any) => {
    const categories = await StrainType.findAll();
    res.status(StatusCodes.OK).json({ success: true, data: categories });
});
export const getGrowMedia = catchAsyncError(async (req: any, res: any, next: any) => {
    const categories = await GrowMedia.findAll();
    res.status(StatusCodes.OK).json({ success: true, data: categories });
});
export const getGrowthMethod = catchAsyncError(async (req: any, res: any, next: any) => {
    const categories = await GrowthMethod.findAll();
    res.status(StatusCodes.OK).json({ success: true, data: categories });
});
export const getTrimMethod = catchAsyncError(async (req: any, res: any, next: any) => {
    const categories = await TrimMethod.findAll();
    res.status(StatusCodes.OK).json({ success: true, data: categories });
});
export const getDryMethod = catchAsyncError(async (req: any, res: any, next: any) => {
    const categories = await DryMethod.findAll();
    res.status(StatusCodes.OK).json({ success: true, data: categories });
});

// Get all subcategories for a specific category
export const getSubCategories = catchAsyncError(async (req: any, res: any, next: any) => {
    const { categoryId } = req.params;

    const subCategories = await SubCategory.findAll({
        where: { category_id: categoryId },
        include: [
            {
                model: Category,
                as: "category"
            }
        ]
    });

    if (subCategories.length === 0) {
        return next(new ErrorHandler('No subcategories found for this category', StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json({ success: true, data: subCategories });
});

export const addCategory = catchAsyncError(async (req: any, res: any, next: any) => {
    const { name } = req.body

    if (!name)
        return next(new ErrorHandler("Name is required!", StatusCodes.BAD_REQUEST))

    const category = await Category.create({
        name: name
    })

    res.status(StatusCodes.CREATED).json({ success: true, message: "Category created successfully!", category })
})

export const addSubCategory = catchAsyncError(async (req: any, res: any, next: any) => {
    const { name, category_id } = req.body

    if (!name)
        return next(new ErrorHandler("Name is required!", StatusCodes.BAD_REQUEST))

    if (!category_id)
        return next(new ErrorHandler("Category is Required!", StatusCodes.BAD_REQUEST))
    const category = await SubCategory.create({
        name,
        category_id
    })

    res.status(StatusCodes.CREATED).json({ success: true, message: "Category created successfully!", category })
})

export const addTHC = catchAsyncError(async (req: any, res: any, next: any) => {
    const { range } = req.body

    if (!range)
        return next(new ErrorHandler("Range is required!", StatusCodes.BAD_REQUEST))

    const thc = await THC.create({
        range: range
    })

    res.status(StatusCodes.CREATED).json({ success: true, message: "Category created successfully!", thc })
})

export const addStrainType = catchAsyncError(async (req: any, res: any, next: any) => {
    const { type } = req.body

    if (!type)
        return next(new ErrorHandler("Strain Type is required!", StatusCodes.BAD_REQUEST))

    const strain_type = await StrainType.create({
        type: type
    })

    res.status(StatusCodes.CREATED).json({ success: true, message: "Category created successfully!", strain_type })
})

export const addGrowMedia = catchAsyncError(async (req: any, res: any, next: any) => {
    const { media } = req.body

    if (!media)
        return next(new ErrorHandler("Media is required!", StatusCodes.BAD_REQUEST))

    const grow_media = await GrowMedia.create({
        media: media
    })

    res.status(StatusCodes.CREATED).json({ success: true, message: "Category created successfully!", grow_media })
})

export const addGrowthMethod = catchAsyncError(async (req: any, res: any, next: any) => {
    const { method } = req.body

    if (!method)
        return next(new ErrorHandler("Growth Method is required!", StatusCodes.BAD_REQUEST))

    const growth_method = await GrowthMethod.create({
        method: method
    })

    res.status(StatusCodes.CREATED).json({ success: true, message: "Category created successfully!", growth_method })
})

export const addTrimMethod = catchAsyncError(async (req: any, res: any, next: any) => {
    const { method } = req.body

    if (!method)
        return next(new ErrorHandler("Trim Method is required!", StatusCodes.BAD_REQUEST))

    const trim_method = await TrimMethod.create({
        method: method
    })

    res.status(StatusCodes.CREATED).json({ success: true, message: "Category created successfully!", trim_method })
})

export const addDryMethod = catchAsyncError(async (req: any, res: any, next: any) => {
    const { method } = req.body

    if (!method)
        return next(new ErrorHandler("Dry Method is required!", StatusCodes.BAD_REQUEST))

    const dry_method = await DryMethod.create({
        method: method
    })

    res.status(StatusCodes.CREATED).json({ success: true, message: "Category created successfully!", dry_method })
})


//===============================================Delete===================================================================================================================

export const deleteCategory = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;

    if (!id)
        return next(new ErrorHandler("Category ID is required!", StatusCodes.BAD_REQUEST));

    await SubCategory.destroy({ where: { category_id: id } })
    await Category.destroy({ where: { id } });

    res.status(StatusCodes.OK).json({ success: true, message: "Category deleted successfully!" });
});

export const deleteSubCategory = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;

    if (!id)
        return next(new ErrorHandler("SubCategory ID is required!", StatusCodes.BAD_REQUEST));

    await SubCategory.destroy({ where: { id } });

    res.status(StatusCodes.OK).json({ success: true, message: "SubCategory deleted successfully!" });
});

export const deleteTHC = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;

    if (!id)
        return next(new ErrorHandler("THC ID is required!", StatusCodes.BAD_REQUEST));

    await THC.destroy({ where: { id } });

    res.status(StatusCodes.OK).json({ success: true, message: "THC deleted successfully!" });
});

export const deleteStrainType = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;

    if (!id)
        return next(new ErrorHandler("Strain Type ID is required!", StatusCodes.BAD_REQUEST));

    await StrainType.destroy({ where: { id } });

    res.status(StatusCodes.OK).json({ success: true, message: "Strain Type deleted successfully!" });
});

export const deleteGrowMedia = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;

    if (!id)
        return next(new ErrorHandler("Grow Media ID is required!", StatusCodes.BAD_REQUEST));

    await GrowMedia.destroy({ where: { id } });

    res.status(StatusCodes.OK).json({ success: true, message: "Grow Media deleted successfully!" });
});

export const deleteGrowthMethod = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;

    if (!id)
        return next(new ErrorHandler("Growth Method ID is required!", StatusCodes.BAD_REQUEST));

    await GrowthMethod.destroy({ where: { id } });

    res.status(StatusCodes.OK).json({ success: true, message: "Growth Method deleted successfully!" });
});

export const deleteTrimMethod = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;

    if (!id)
        return next(new ErrorHandler("Trim Method ID is required!", StatusCodes.BAD_REQUEST));

    await TrimMethod.destroy({ where: { id } });

    res.status(StatusCodes.OK).json({ success: true, message: "Trim Method deleted successfully!" });
});

export const deleteDryMethod = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;

    if (!id)
        return next(new ErrorHandler("Dry Method ID is required!", StatusCodes.BAD_REQUEST));

    await DryMethod.destroy({ where: { id } });

    res.status(StatusCodes.OK).json({ success: true, message: "Dry Method deleted successfully!" });
});

// ==================================================Get Single======================================================
export const getSingleCategory = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;

    const category = await Category.findByPk(id)

    if (!category)
        return next(new ErrorHandler("Category Not Found!", StatusCodes.NOT_FOUND))

    res.status(StatusCodes.OK).json({ success: true, category })
})

export const getSingleSubCategory = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;

    const subCategory = await SubCategory.findByPk(id);

    if (!subCategory)
        return next(new ErrorHandler("SubCategory Not Found!", StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK).json({ success: true, subCategory });
});

export const getSingleTHC = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;

    const thc = await THC.findByPk(id);

    if (!thc)
        return next(new ErrorHandler("THC Not Found!", StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK).json({ success: true, thc });
});

export const getSingleStrainType = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;

    const strainType = await StrainType.findByPk(id);

    if (!strainType)
        return next(new ErrorHandler("Strain Type Not Found!", StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK).json({ success: true, strainType });
});

export const getSingleGrowMedia = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;

    const growMedia = await GrowMedia.findByPk(id);

    if (!growMedia)
        return next(new ErrorHandler("Grow Media Not Found!", StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK).json({ success: true, growMedia });
});

export const getSingleGrowthMethod = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;

    const growthMethod = await GrowthMethod.findByPk(id);

    if (!growthMethod)
        return next(new ErrorHandler("Growth Method Not Found!", StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK).json({ success: true, growthMethod });
});

export const getSingleTrimMethod = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;

    const trimMethod = await TrimMethod.findByPk(id);

    if (!trimMethod)
        return next(new ErrorHandler("Trim Method Not Found!", StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK).json({ success: true, trimMethod });
});

export const getSingleDryMethod = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;

    const dryMethod = await DryMethod.findByPk(id);

    if (!dryMethod)
        return next(new ErrorHandler("Dry Method Not Found!", StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK).json({ success: true, dryMethod });
});

// ===============================================Update==========================================================================
export const updateCategory = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name)
        return next(new ErrorHandler("Name is required!", StatusCodes.BAD_REQUEST));

    const [updated] = await Category.update({ name }, { where: { id } });

    if (!updated)
        return next(new ErrorHandler("Category not found!", StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK).json({ success: true, message: "Category updated successfully!" });
});

export const updateSubCategory = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;
    const { name, category_id } = req.body;

    if (!name || !category_id)
        return next(new ErrorHandler("Name and Category ID are required!", StatusCodes.BAD_REQUEST));

    const [updated] = await SubCategory.update({ name, category_id }, { where: { id } });

    if (!updated)
        return next(new ErrorHandler("SubCategory not found!", StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK).json({ success: true, message: "SubCategory updated successfully!" });
});

export const updateTHC = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;
    const { range } = req.body;

    if (!range)
        return next(new ErrorHandler("Range is required!", StatusCodes.BAD_REQUEST));

    const [updated] = await THC.update({ range }, { where: { id } });

    if (!updated)
        return next(new ErrorHandler("THC not found!", StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK).json({ success: true, message: "THC updated successfully!" });
});

export const updateStrainType = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;
    const { type } = req.body;

    if (!type)
        return next(new ErrorHandler("Strain Type is required!", StatusCodes.BAD_REQUEST));

    const [updated] = await StrainType.update({ type }, { where: { id } });

    if (!updated)
        return next(new ErrorHandler("Strain Type not found!", StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK).json({ success: true, message: "Strain Type updated successfully!" });
});

export const updateGrowMedia = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;
    const { media } = req.body;

    if (!media)
        return next(new ErrorHandler("Media is required!", StatusCodes.BAD_REQUEST));

    const [updated] = await GrowMedia.update({ media }, { where: { id } });

    if (!updated)
        return next(new ErrorHandler("Grow Media not found!", StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK).json({ success: true, message: "Grow Media updated successfully!" });
});

export const updateGrowthMethod = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;
    const { method } = req.body;

    if (!method)
        return next(new ErrorHandler("Growth Method is required!", StatusCodes.BAD_REQUEST));

    const [updated] = await GrowthMethod.update({ method }, { where: { id } });

    if (!updated)
        return next(new ErrorHandler("Growth Method not found!", StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK).json({ success: true, message: "Growth Method updated successfully!" });
});

export const updateTrimMethod = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;
    const { method } = req.body;

    if (!method)
        return next(new ErrorHandler("Trim Method is required!", StatusCodes.BAD_REQUEST));

    const [updated] = await TrimMethod.update({ method }, { where: { id } });

    if (!updated)
        return next(new ErrorHandler("Trim Method not found!", StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK).json({ success: true, message: "Trim Method updated successfully!" });
});

export const updateDryMethod = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;
    const { method } = req.body;

    if (!method)
        return next(new ErrorHandler("Dry Method is required!", StatusCodes.BAD_REQUEST));

    const [updated] = await DryMethod.update({ method }, { where: { id } });

    if (!updated)
        return next(new ErrorHandler("Dry Method not found!", StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK).json({ success: true, message: "Dry Method updated successfully!" });
});

import { Router } from "express";
import { dashboardData, deleteProduct, deleteUser, getAllCompany, getAllUsers, getSingleCompany, getSingleUser, uploadImages } from "./admin.controller";
import { auth, onlyAdmin } from "../../middleware/auth";
import { addCategory, addDryMethod, addGrowMedia, addGrowthMethod, addStrainType, addSubCategory, addTHC, addTrimMethod, deleteCategory, deleteDryMethod, deleteGrowMedia, deleteGrowthMethod, deleteStrainType, deleteSubCategory, deleteTHC, deleteTrimMethod, getSingleCategory, getSingleDryMethod, getSingleGrowMedia, getSingleGrowthMethod, getSingleStrainType, getSingleSubCategory, getSingleTHC, getSingleTrimMethod, updateCategory, updateDryMethod, updateGrowMedia, updateGrowthMethod, updateStrainType, updateSubCategory, updateTHC, updateTrimMethod } from "../@CATEGORY_ENTITY/category.controller";
import { upload } from "../../utils/s3";
import { createUpdateContent, deleteContent, deleteQuery, getContent, getQuery, respondToQuery } from "../@CONTENT_ENTITY/content.controller";
import { activateDeactivateUser } from "../@USER_ENTITY/user.controller";

const router = Router()

// Dashboard
router.get('/dashboard', auth, onlyAdmin, dashboardData)

// Users
router.get('/getAllUsers', auth, onlyAdmin, getAllUsers)
router.route('/user/:id')
    .get(auth, onlyAdmin, getSingleUser)
    .delete(auth, onlyAdmin, deleteUser)
router.post('/user-status/:id', auth, onlyAdmin, activateDeactivateUser)
//Company
router.get('/getAllCompanies', auth, onlyAdmin, getAllCompany)
router.route('/company/:id')
    .get(auth, onlyAdmin, getSingleCompany)
// ==============================Category===============================
// Add
router.post('/addCategory', auth, onlyAdmin, addCategory)
router.post('/addSubCategory', auth, onlyAdmin, addSubCategory)
router.post('/addTHC', auth, onlyAdmin, addTHC)
router.post('/addStrainType', auth, onlyAdmin, addStrainType)
router.post('/addGrowMedia', auth, onlyAdmin, addGrowMedia)
router.post('/addGrowthMethod', auth, onlyAdmin, addGrowthMethod)
router.post('/addTrimMethod', auth, onlyAdmin, addTrimMethod)
router.post('/addDryMethod', auth, onlyAdmin, addDryMethod)

// Delete
router.delete('/deleteCategory/:id', auth, onlyAdmin, deleteCategory);
router.delete('/deleteSubCategory/:id', auth, onlyAdmin, deleteSubCategory);
router.delete('/deleteTHC/:id', auth, onlyAdmin, deleteTHC);
router.delete('/deleteStrainType/:id', auth, onlyAdmin, deleteStrainType);
router.delete('/deleteGrowMedia/:id', auth, onlyAdmin, deleteGrowMedia);
router.delete('/deleteGrowthMethod/:id', auth, onlyAdmin, deleteGrowthMethod);
router.delete('/deleteTrimMethod/:id', auth, onlyAdmin, deleteTrimMethod);
router.delete('/deleteDryMethod/:id', auth, onlyAdmin, deleteDryMethod);

// Single
router.get('/getSingleCategory/:id', auth, onlyAdmin, getSingleCategory);
router.get('/getSingleSubCategory/:id', auth, onlyAdmin, getSingleSubCategory)
router.get('/getSingleTHC/:id', auth, onlyAdmin, getSingleTHC);
router.get('/getSingleStrainType/:id', auth, onlyAdmin, getSingleStrainType);
router.get('/getSingleGrowMedia/:id', auth, onlyAdmin, getSingleGrowMedia);
router.get('/getSingleGrowthMethod/:id', auth, onlyAdmin, getSingleGrowthMethod);
router.get('/getSingleTrimMethod/:id', auth, onlyAdmin, getSingleTrimMethod);
router.get('/getSingleDryMethod/:id', auth, onlyAdmin, getSingleDryMethod);

// Update
router.put('/updateCategory/:id', auth, onlyAdmin, updateCategory);
router.put('/updateSubCategory/:id', auth, onlyAdmin, updateSubCategory);
router.put('/updateTHC/:id', auth, onlyAdmin, updateTHC);
router.put('/updateStrainType/:id', auth, onlyAdmin, updateStrainType);
router.put('/updateGrowMedia/:id', auth, onlyAdmin, updateGrowMedia);
router.put('/updateGrowthMethod/:id', auth, onlyAdmin, updateGrowthMethod);
router.put('/updateTrimMethod/:id', auth, onlyAdmin, updateTrimMethod);
router.put('/updateDryMethod/:id', auth, onlyAdmin, updateDryMethod);

// ===============================Product=======================================================
router.delete('/product/:id', auth, onlyAdmin, deleteProduct)

// ================================Content======================================================
router.route('/content')
    .get(auth, onlyAdmin, getContent)
    .delete(auth, onlyAdmin, deleteContent)
    .post(auth, onlyAdmin, createUpdateContent)

// ================================Query========================================================
router.get('/query', auth, onlyAdmin, getQuery)
router.route('/query/:id')
    .post(auth, onlyAdmin, respondToQuery)
    .delete(auth, onlyAdmin, deleteQuery)
export default router
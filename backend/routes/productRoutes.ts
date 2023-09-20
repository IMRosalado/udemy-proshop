import express from "express";
import {getProducts, getProductById, createProduct, deleteProduct, updateProduct, createProductRevew, getTopProducts} from "../controllers/productController";
import { admin, protect } from "../middleware/authMiddleware";
import checkObjectId from '../middleware/checkObjectId';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct)
router.get('/top', getTopProducts);
router.route('/:id').get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct)
router.route('/:id/reviews').post(protect, checkObjectId, createProductRevew)

export default router;
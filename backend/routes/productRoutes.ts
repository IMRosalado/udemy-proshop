import express from "express";
import {getProducts, getProductById, createProduct, deleteProduct, updateProduct, createProductRevew, getTopProducts} from "../controllers/productController";
import { admin, protect } from "../middleware/authMiddleware";

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct)
router.get('/top', getTopProducts);
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct)
router.route('/:id/reviews').post(protect, createProductRevew)

export default router;
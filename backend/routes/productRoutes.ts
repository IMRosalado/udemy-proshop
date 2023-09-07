import express from "express";
import {getProducts, getProductById, createProduct, deleteProduct, updateProduct} from "../controllers/productController";
import { admin, protect } from "../middleware/authMiddleware";

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct)
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct)

export default router;
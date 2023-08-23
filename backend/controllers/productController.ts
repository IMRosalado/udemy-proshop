import asyncHandler from "../middleware/asyncHandler";
import Product from "../models/ProductModel";

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if(product) {
    return res.json(product);

  }

  res.status(404);
  new Error('Product not found');
})

export {getProducts, getProductById};
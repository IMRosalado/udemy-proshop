import asyncHandler from "../middleware/asyncHandler";
import Product from "../models/ProductModel";

/**
 * @desc Get all products
 * @route GET /api/products
 * @access public
 */
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

/**
 * @desc Get product  by ID
 * @route GET /api/products/:id
 * @access public
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if(product) {
    return res.json(product);

  }

  res.status(404);
  new Error('Product not found');
})

/**
 * @desc Create a product
 * @route POST /api/products
 * @access private/admin
 */
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample Name",
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample Brand',
    category: 'Sample Category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample Description'
  })

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
})

/**
 * @desc Update a product
 * @route PUT /api/products/:id
 * @access private/admin
 */
const updateProduct = asyncHandler(async (req,res) => {

  const { name, price, description, image, brand, category, countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if(product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();

    res.status(201).json(updatedProduct)
  } else {
    res.status(404)
    throw new Error("Resource not found")
  }
})



/**
 * @desc Delete a product
 * @route DELETE /api/products/:id
 * @access private/admin
 */
const deleteProduct = asyncHandler(async (req,res) => {
  const product = await Product.findById(req.params.id);

  if(product) {
    await Product.deleteOne({_id: product._id});
    res.status(201).json({message: "Product Deleted"})
  } else {
    res.status(404)
    throw new Error("Resource not found")
  }
})

export {getProducts, getProductById, createProduct, updateProduct, deleteProduct};
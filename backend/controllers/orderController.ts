import asyncHandler from "../middleware/asyncHandler";
import Order from "../models/OrderModel";
import Product from "../models/ProductModel";
import { calculatePrices } from '../utils/calculatePrices';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypalUtils';

/**
 * @desc Create new order
 * @route POST /api/orders
 * @access Private
 */
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod
  } = req.body
  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error("No order items")
  } else {

    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((orderItem => orderItem._id))}
    });

    const dbOrderItems = orderItems.map(itemFromClient => {
      const amtchingItemFromDB = itemsFromDB.find(itemFromDB => itemFromDB._id.toString() === itemFromClient._id);
      
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: amtchingItemFromDB.price,
        _id: undefined
      }
    })

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calculatePrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    })

    const createdOrder = await order.save();

    res.status(201).json(createdOrder)
  }
});

/**
 * @desc Get logged in user's orders
 * @route GET /api/orders/myorders
 * @access Private
 */
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({user : req.user._id})
  res.status(201).json(orders)
});

/**
 * @desc Get order by id
 * @route GET /api/orders/:id
 * @access Private
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  
  if (order) {
    res.status(201).json(order)
  } else {
    res.status(404)
    throw new Error("Order not found")
  }
});

/**
 * @desc Update order to paid
 * @route PUT /api/orders/:id/pay
 * @access Private/Admin
 */
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const { verified, value } = await verifyPayPalPayment(req.body.id);

  if (!verified) throw new Error ("Payment not verified");

  //check if new transaction
  const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  if (!isNewTransaction) throw new Error("Transaction has been used before");
  
  const order = await Order.findById(req.params.id);

  if (order) {

    const paidCorrectAmount = order.totalPrice.toString() === value;
    if (!paidCorrectAmount) throw new Error("Incorrect amount paid");

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      updateTime: req.body.updateTime,
      emailAddress: req.body.payer.emailAddress
    }

    const updatedOrder = await order.save();

    res.status(201).json(updatedOrder)
  } else {
    res.status(404)
    throw new Error("Order not found")
  }
  
});

/**
 * @desc Update order to delivered
 * @route PUT /api/orders/:id/deliver
 * @access Private/Admin
 */
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updatedOrder = await order.save();

    res.status(201).json(updatedOrder)
  } else {
    res.status(404)
    throw new Error("Order not found")
  }
});

/**
 * @desc Get All orders
 * @route Get /api/orders/
 * @access Private/Admin
 */
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');

  res.status(201).json(orders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
  updateOrderToPaid
}
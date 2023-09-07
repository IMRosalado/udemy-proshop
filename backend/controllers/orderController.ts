import asyncHandler from "../middleware/asyncHandler";
import Order from "../models/OrderModel";

/**
 * @desc Create new order
 * @route POST /api/orders
 * @access Private
 */
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice
  } = req.body
  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error("No order items")
  } else {
    const order = new Order({
      orderItems: orderItems.map((order) => {
        return {
          ...order,
        product: order._id,
        _id: undefined
        }
      }),
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
  const order = await Order.findById(req.params.id);

  if (order) {
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
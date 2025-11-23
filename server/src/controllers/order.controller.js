const OrderService = require("../services/order.service");

const OrderController = {
  // GET /api/orders
  getAll: async (req, res) => {
    try {
      const orders = await OrderService.getAllOrders();
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/orders/user/:userId
  getByUserId: async (req, res) => {
    try {
      const userId = req.params.userId;
      const orders = await OrderService.getOrdersByUserId(userId);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/orders
  create: async (req, res) => {
    try {
      const {
        user_id,
        region_id,
        promotion_id,
        shipping_fee,
        total_price,
        payment_method,
        delivery_time,
        note,
        items,
      } = req.body;

      if (
        !user_id ||
        !region_id ||
        !total_price ||
        !payment_method ||
        !Array.isArray(items) ||
        items.length === 0
      ) {
        return res
          .status(400)
          .json({ message: "Missing or invalid order data." });
      }

      const result = await OrderService.createOrder({
        user_id,
        region_id,
        promotion_id,
        shipping_fee,
        total_price,
        payment_method,
        delivery_time,
        note,
        items,
      });

      res.status(201).json({
        message: "Order created successfully.",
        order_id: result.orderId,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PUT /api/orders/:id
  update: async (req, res) => {
    try {
      const id = req.params.id;
      const allowedFields = [
        "status",
        "delivery_time",
        "note",
        "promotion_id",
        "shipping_fee",
      ];
      const updateData = {};

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No valid fields to update." });
      }

      const success = await OrderService.updateOrder(id, updateData);

      if (!success) {
        return res
          .status(404)
          .json({ message: "Order not found or update failed." });
      }

      res.json({ message: "Order updated successfully." });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = OrderController;

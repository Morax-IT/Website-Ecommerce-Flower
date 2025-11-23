const db = require("../config/database.config");

const OrderService = {
  // 1. Lấy tất cả đơn hàng
  getAllOrders: async () => {
    const [orders] = await db.query(
      `SELECT * FROM orders ORDER BY created_at DESC`
    );

    for (const order of orders) {
      const [items] = await db.query(
        `
        SELECT * FROM order_items WHERE order_id = ?
      `,
        [order.id]
      );

      order.items = items;
    }

    return orders;
  },

  // 2. Lấy đơn hàng theo user_id
  getOrdersByUserId: async (userId) => {
    const [orders] = await db.query(
      `
      SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
    `,
      [userId]
    );

    for (const order of orders) {
      const [items] = await db.query(
        `
        SELECT * FROM order_items WHERE order_id = ?
      `,
        [order.id]
      );

      order.items = items;
    }

    return orders;
  },

  // 3. Tạo đơn hàng mới (bao gồm order_items)
  createOrder: async (orderData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const {
        user_id,
        region_id,
        promotion_id = null,
        shipping_fee = 0,
        total_price,
        payment_method,
        delivery_time,
        note,
        items, // array of items [{product_id, quantity, selected_variants, selected_addons, price}]
      } = orderData;

      const [orderResult] = await connection.query(
        `
        INSERT INTO orders (
          user_id, region_id, promotion_id,
          shipping_fee, total_price, payment_method,
          delivery_time, note
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          user_id,
          region_id,
          promotion_id,
          shipping_fee,
          total_price,
          payment_method,
          delivery_time,
          note,
        ]
      );

      const orderId = orderResult.insertId;

      for (const item of items) {
        const {
          product_id,
          quantity,
          selected_variants,
          selected_addons,
          price,
        } = item;

        await connection.query(
          `
          INSERT INTO order_items (
            order_id, product_id, quantity,
            selected_variants, selected_addons, price
          ) VALUES (?, ?, ?, ?, ?, ?)
        `,
          [
            orderId,
            product_id,
            quantity,
            JSON.stringify(selected_variants || {}),
            JSON.stringify(selected_addons || []),
            price,
          ]
        );
      }

      await connection.commit();
      return { orderId };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  // 4. Cập nhật đơn hàng (cập nhật status, note, delivery_time, v.v.)
  updateOrder: async (id, updateData) => {
    const fields = [];
    const values = [];

    for (const key in updateData) {
      fields.push(`${key} = ?`);
      values.push(updateData[key]);
    }

    values.push(id);

    const [result] = await db.query(
      `
      UPDATE orders SET ${fields.join(", ")}
      WHERE id = ?
    `,
      values
    );

    return result.affectedRows > 0;
  },
};

module.exports = OrderService;

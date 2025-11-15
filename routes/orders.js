import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// GET - Listar pedidos do usuário
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const connection = await pool.getConnection();
    
    const [orders] = await connection.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    // Buscar itens de cada pedido
    for (let order of orders) {
      const [items] = await connection.query(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );
      order.items = items;
    }
    
    connection.release();
    
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar pedidos',
      message: error.message
    });
  }
});

// GET - Obter detalhes de um pedido específico
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const connection = await pool.getConnection();
    
    const [orders] = await connection.query(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    );
    
    if (orders.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        error: 'Pedido não encontrado'
      });
    }
    
    const order = orders[0];
    
    // Buscar itens do pedido
    const [items] = await connection.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );
    
    order.items = items;
    
    connection.release();
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Erro ao obter pedido:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao obter pedido',
      message: error.message
    });
  }
});

// POST - Criar novo pedido
router.post('/create', async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod } = req.body;
    
    if (!userId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'userId e items são obrigatórios'
      });
    }
    
    const connection = await pool.getConnection();
    
    // Iniciar transação
    await connection.beginTransaction();
    
    try {
      // Calcular total
      let totalAmount = 0;
      
      // Validar produtos e calcular total
      for (const item of items) {
        const [products] = await connection.query(
          'SELECT id, name, price FROM products WHERE id = ?',
          [item.product_id]
        );
        
        if (products.length === 0) {
          throw new Error(`Produto com ID ${item.product_id} não encontrado`);
        }
        
        const product = products[0];
        const subtotal = product.price * item.quantity;
        totalAmount += subtotal;
        
        // Adicionar informações do produto ao item
        item.product_name = product.name;
        item.product_price = product.price;
        item.subtotal = subtotal;
      }
      
      // Criar pedido
      const [orderResult] = await connection.query(
        'INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method) VALUES (?, ?, ?, ?, ?)',
        [userId, totalAmount, 'pending', shippingAddress, paymentMethod]
      );
      
      const orderId = orderResult.insertId;
      
      // Adicionar itens do pedido
      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, size, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [orderId, item.product_id, item.product_name, item.product_price, item.quantity, item.size, item.subtotal]
        );
      }
      
      // Limpar carrinho do usuário
      await connection.query('DELETE FROM cart WHERE user_id = ?', [userId]);
      
      // Confirmar transação
      await connection.commit();
      
      res.status(201).json({
        success: true,
        message: 'Pedido criado com sucesso',
        data: { 
          orderId: orderId,
          totalAmount: totalAmount.toFixed(2)
        }
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar pedido',
      message: error.message
    });
  }
});

// PUT - Atualizar status do pedido
router.put('/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status inválido. Use: pending, processing, shipped, delivered ou cancelled'
      });
    }
    
    const connection = await pool.getConnection();
    
    await connection.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    );
    
    connection.release();
    
    res.json({
      success: true,
      message: 'Status do pedido atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar status',
      message: error.message
    });
  }
});

export default router;

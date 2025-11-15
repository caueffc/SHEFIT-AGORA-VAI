import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// GET - Obter carrinho do usuário
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const connection = await pool.getConnection();
    
    const [cartItems] = await connection.query(`
      SELECT c.id, c.quantity, c.size, p.id as product_id, p.name, p.price, p.image, p.color
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [userId]);
    
    // Calcular total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    connection.release();
    
    res.json({
      success: true,
      data: {
        items: cartItems,
        total: total.toFixed(2)
      }
    });
  } catch (error) {
    console.error('Erro ao obter carrinho:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao obter carrinho',
      message: error.message
    });
  }
});

// POST - Adicionar item ao carrinho
router.post('/add', async (req, res) => {
  try {
    const { userId, productId, quantity = 1, size } = req.body;
    
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        error: 'userId e productId são obrigatórios'
      });
    }
    
    const connection = await pool.getConnection();
    
    // Verificar se o produto existe
    const [products] = await connection.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    );
    
    if (products.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }
    
    // Verificar se o item já existe no carrinho
    const [existingItems] = await connection.query(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    
    if (existingItems.length > 0) {
      // Atualizar quantidade
      await connection.query(
        'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, userId, productId]
      );
    } else {
      // Inserir novo item
      await connection.query(
        'INSERT INTO cart (user_id, product_id, quantity, size) VALUES (?, ?, ?, ?)',
        [userId, productId, quantity, size]
      );
    }
    
    connection.release();
    
    res.status(201).json({
      success: true,
      message: 'Item adicionado ao carrinho com sucesso'
    });
  } catch (error) {
    console.error('Erro ao adicionar item ao carrinho:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao adicionar item ao carrinho',
      message: error.message
    });
  }
});

// PUT - Atualizar quantidade de item no carrinho
router.put('/update/:cartId', async (req, res) => {
  try {
    const { cartId } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Quantidade deve ser maior que zero'
      });
    }
    
    const connection = await pool.getConnection();
    
    await connection.query(
      'UPDATE cart SET quantity = ? WHERE id = ?',
      [quantity, cartId]
    );
    
    connection.release();
    
    res.json({
      success: true,
      message: 'Quantidade atualizada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar item',
      message: error.message
    });
  }
});

// DELETE - Remover item do carrinho
router.delete('/remove/:cartId', async (req, res) => {
  try {
    const { cartId } = req.params;
    
    const connection = await pool.getConnection();
    
    await connection.query('DELETE FROM cart WHERE id = ?', [cartId]);
    
    connection.release();
    
    res.json({
      success: true,
      message: 'Item removido do carrinho com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover item:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao remover item',
      message: error.message
    });
  }
});

// DELETE - Limpar carrinho do usuário
router.delete('/clear/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const connection = await pool.getConnection();
    
    await connection.query('DELETE FROM cart WHERE user_id = ?', [userId]);
    
    connection.release();
    
    res.json({
      success: true,
      message: 'Carrinho limpo com sucesso'
    });
  } catch (error) {
    console.error('Erro ao limpar carrinho:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao limpar carrinho',
      message: error.message
    });
  }
});

export default router;

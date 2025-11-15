import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// GET - Listar todos os produtos
router.get('/', async (req, res) => {
  try {
    const { category, availability, search } = req.query;
    
    const connection = await pool.getConnection();
    
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    
    // Filtrar por categoria
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    // Filtrar por disponibilidade
    if (availability) {
      query += ' AND availability = ?';
      params.push(availability);
    }
    
    // Buscar por nome
    if (search) {
      query += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }
    
    query += ' ORDER BY id';
    
    const [products] = await connection.query(query, params);
    connection.release();
    
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar produtos',
      message: error.message
    });
  }
});

// GET - Obter produto por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [products] = await connection.query('SELECT * FROM products WHERE id = ?', [id]);
    connection.release();
    
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: products[0]
    });
  } catch (error) {
    console.error('Erro ao obter produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao obter produto',
      message: error.message
    });
  }
});

// GET - Listar categorias disponíveis
router.get('/meta/categories', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [categories] = await connection.query(
      'SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category'
    );
    connection.release();
    
    res.json({
      success: true,
      data: categories.map(c => c.category)
    });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar categorias',
      message: error.message
    });
  }
});

// POST - Criar novo produto
router.post('/', async (req, res) => {
  try {
    const { name, description, price, original_price, image, color, category, availability, shipping_area, shipping_cost, rating } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        error: 'Nome e preço são obrigatórios'
      });
    }
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO products (name, description, price, original_price, image, color, category, availability, shipping_area, shipping_cost, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, original_price, image, color, category, availability, shipping_area, shipping_cost, rating]
    );
    connection.release();
    
    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar produto',
      message: error.message
    });
  }
});

// PUT - Atualizar produto
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, original_price, image, color, category, availability, shipping_area, shipping_cost, rating } = req.body;
    
    const connection = await pool.getConnection();
    
    // Verificar se o produto existe
    const [products] = await connection.query('SELECT * FROM products WHERE id = ?', [id]);
    
    if (products.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }
    
    // Construir query de atualização dinamicamente
    const updates = [];
    const values = [];
    
    if (name !== undefined) { updates.push('name = ?'); values.push(name); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (price !== undefined) { updates.push('price = ?'); values.push(price); }
    if (original_price !== undefined) { updates.push('original_price = ?'); values.push(original_price); }
    if (image !== undefined) { updates.push('image = ?'); values.push(image); }
    if (color !== undefined) { updates.push('color = ?'); values.push(color); }
    if (category !== undefined) { updates.push('category = ?'); values.push(category); }
    if (availability !== undefined) { updates.push('availability = ?'); values.push(availability); }
    if (shipping_area !== undefined) { updates.push('shipping_area = ?'); values.push(shipping_area); }
    if (shipping_cost !== undefined) { updates.push('shipping_cost = ?'); values.push(shipping_cost); }
    if (rating !== undefined) { updates.push('rating = ?'); values.push(rating); }
    
    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({
        success: false,
        error: 'Nenhum campo para atualizar'
      });
    }
    
    values.push(id);
    
    await connection.query(
      `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    connection.release();
    
    res.json({
      success: true,
      message: 'Produto atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar produto',
      message: error.message
    });
  }
});

// DELETE - Remover produto
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    
    // Verificar se o produto existe
    const [products] = await connection.query('SELECT * FROM products WHERE id = ?', [id]);
    
    if (products.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }
    
    await connection.query('DELETE FROM products WHERE id = ?', [id]);
    
    connection.release();
    
    res.json({
      success: true,
      message: 'Produto removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao remover produto',
      message: error.message
    });
  }
});

export default router;

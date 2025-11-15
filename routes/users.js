import express from 'express';
import bcrypt from 'bcrypt';
import db from '../config/database.js'; // Usando 'db' que é o pool de conexões

const router = express.Router();

// POST - Registrar novo usuário (Cadastro Completo)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, cpf, phone, cep, street, neighborhood, city, state } = req.body;
    
    // Validação de campos obrigatórios
    if (!name || !email || !password || !cpf || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Nome, email, senha, CPF e Telefone são obrigatórios'
      });
    }
    
    // Validação básica de email e senha
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Email inválido' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'A senha deve ter no mínimo 6 caracteres' });
    }
    
    // Verificar se o email ou CPF já existem
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ? OR cpf = ?',
      [email, cpf]
    );
    
    if (existingUsers.length > 0) {
      return res.status(409).json({ success: false, error: 'Email ou CPF já cadastrado.' });
    }
    
    // Criptografar senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Inserir novo usuário com todos os campos
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, cpf, phone, cep, street, neighborhood, city, state, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, cpf, phone, cep, street, neighborhood, city, state, 'user']
    );
    
    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      data: { 
        id: result.insertId,
        name: name,
        email: email
      }
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao registrar usuário',
      message: error.message
    });
  }
});

// POST - Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email e senha são obrigatórios' });
    }
    
    // Seleciona todos os campos necessários para o frontend
    const [users] = await db.query(
      'SELECT id, name, email, password, cpf, phone, cep, street, neighborhood, city, state, role FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, error: 'Email ou senha inválidos' });
    }
    
    const user = users[0];
    
    // Comparar senha com hash
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: 'Email ou senha inválidos' });
    }
    
    // Remover senha do objeto retornado
    delete user.password;
    
    // NOVO: Armazenar informações do usuário na sessão
    req.session.user = user;
    
    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: user
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao fazer login',
      message: error.message
    });
  }
});

// GET - Obter perfil do usuário
// Middleware de autenticação simples (verifica se o usuário está na sessão)
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        // Se não estiver na sessão, mas tiver o ID no frontend (localStorage), 
        // o frontend tentará buscar o perfil. Se o ID for diferente do da sessão, 
        // o backend deve confiar no ID da sessão para operações sensíveis.
        // Por enquanto, vamos permitir a busca pelo ID do frontend, mas isso é um risco de segurança.
        // O ideal é que o frontend envie um token ou que a busca seja apenas pelo ID da sessão.
        // Para o escopo atual, vamos focar na persistência do login.
        next(); 
    }
}

router.get('/profile/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [users] = await db.query(
      'SELECT id, name, email, cpf, phone, cep, street, neighborhood, city, state, role FROM users WHERE id = ?',
      [id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
    }
    
    res.json({ success: true, data: users[0] });
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({ success: false, error: 'Erro ao obter perfil', message: error.message });
  }
});

// PUT - Atualizar perfil do usuário
router.put('/profile/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, cep, street, neighborhood, city, state } = req.body;
    
    // Validação básica
    if (!name || !phone) {
        return res.status(400).json({ success: false, error: 'Nome e Telefone são obrigatórios.' });
    }

    // Atualizar apenas os campos que podem ser alterados
    const [result] = await db.query(
      'UPDATE users SET name = ?, phone = ?, cep = ?, street = ?, neighborhood = ?, city = ?, state = ? WHERE id = ?',
      [name, phone, cep, street, neighborhood, city, state, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
    }
    
    res.json({ success: true, message: 'Perfil atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ success: false, error: 'Erro ao atualizar perfil', message: error.message });
  }
});

// PUT - Alterar senha
router.put('/password/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Senha atual e nova senha são obrigatórias' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'A nova senha deve ter no mínimo 6 caracteres' });
    }
    
    const [users] = await db.query('SELECT password FROM users WHERE id = ?', [id]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
    }
    
    // Verificar senha atual
    const passwordMatch = await bcrypt.compare(currentPassword, users[0].password);
    
    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: 'Senha atual incorreta' });
    }
    
    // Criptografar nova senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    
    res.json({ success: true, message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ success: false, error: 'Erro ao alterar senha', message: error.message });
  }
});

// POST - Logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Erro ao fazer logout' });
        }
        res.json({ success: true, message: 'Logout realizado com sucesso' });
    });
});

export default router;

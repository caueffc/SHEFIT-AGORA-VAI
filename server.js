import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
// server.js (Início do arquivo)
import session from 'express-session'; // <-- A linha que você adicionou
import path from 'path';
import { fileURLToPath } from 'url';


// Importar rotas
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Obter __dirname em módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.CORS_ORIGIN || true) 
    : 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
// server.js (Meio do arquivo, após os body-parsers)
// ...
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração de Sessão <-- ADICIONE ESTE BLOCO
app.use(session({
  secret: process.env.SESSION_SECRET || 'seu_segredo_muito_secreto',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// Servir arquivos estáticos
// ...
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(__dirname));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/data', express.static(path.join(__dirname, 'data')));

// Rotas da API
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor rodando normalmente' });
});

// Servir views HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Redirecionar /index para /
app.get('/index', (req, res) => {
  res.redirect('/');
});

app.get('/produto', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'produto.html'));
});

app.get('/carrinho', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'carrinho.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cadastro.html'));
});

app.get('/produtostela', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'produtostela.html'));
});
app.get('/perfil', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'perfil.html'));
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📁 Arquivos estáticos sendo servidos de: ${__dirname}`);
  console.log(`🌎 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
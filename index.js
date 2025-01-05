require('dotenv').config(); // Carrega as variáveis de ambiente do .env
const express = require('express');
const mysql = require('mysql2');

// Configurações do banco de dados
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Verifica conexão com o banco
db.getConnection((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados.');
  }
});

// Configuração do Express
const app = express();
const PORT = 3000;

// Rota para buscar consumidor pelo ID
app.get('/consumidores/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID inválido.',
    });
  }

  const query = 'SELECT * FROM consumidores WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao consultar o banco de dados.',
      });
    }

    if (results.length > 0) {
      res.json({
        success: true,
        data: results[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Consumidor não encontrado.',
      });
    }
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

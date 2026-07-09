const express = require('express');
const path = require('path');
const initSqlJs = require('sql.js');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function initDB() {
  const SQL = await initSqlJs();
  let db;
  if (fs.existsSync('simpli.db')) {
    const fileBuffer = fs.readFileSync('simpli.db');
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }
  db.run(`CREATE TABLE IF NOT EXISTS contatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    data_envio DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  const data = db.export();
  fs.writeFileSync('simpli.db', Buffer.from(data));
  return db;
}

let dbPromise = initDB();

app.post('/api/contato', async (req, res) => {
  const { nome, email, mensagem } = req.body;
  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: 'Por favor, preencha todos os campos.' });
  }
  try {
    const db = await dbPromise;
    db.run("INSERT INTO contatos (nome, email, mensagem) VALUES (?, ?, ?)", [nome, email, mensagem]);
    const data = db.export();
    fs.writeFileSync('simpli.db', Buffer.from(data));
    res.json({ success: 'Mensagem enviada com sucesso! Entraremos em contato em breve.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno. Tente novamente.' });
  }
});

app.listen(PORT, () => {
  console.log(`SIMPLi rodando em http://localhost:${PORT}`);
});
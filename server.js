const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Configuração do body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuração de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// View engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Banco de dados
const db = new sqlite3.Database('./models/usuarios.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Conectado ao banco de dados SQLite.');
});

// Criação da tabela se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_completo TEXT,
    cpf TEXT,
    data_nascimento TEXT,
    cnpj TEXT,
    endereco_empresa TEXT,
    endereco_socio TEXT,
    telefone_whatsapp TEXT
  )
`);

// Rota: Página de cadastro
app.get('/cadastro', (req, res) => {
  res.render('cadastro');
});

// Rota: Recebe dados do formulário
app.post('/cadastrar', (req, res) => {
  const { nome_completo, cpf, data_nascimento, cnpj, endereco_empresa, endereco_socio, telefone_whatsapp } = req.body;

  const query = `INSERT INTO usuarios (nome_completo, cpf, data_nascimento, cnpj, endereco_empresa, endereco_socio, telefone_whatsapp)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.run(query, [nome_completo, cpf, data_nascimento, cnpj, endereco_empresa, endereco_socio, telefone_whatsapp], function (err) {
    if (err) return console.error(err.message);
    res.send('Usuário cadastrado com sucesso!');
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
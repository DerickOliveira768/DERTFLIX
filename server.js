const fs = require('fs');
const path = require('path');
const express = require('express');
const jsonServer = require('json-server');

const dbPath = path.join(__dirname, 'db.json');

// Garante que o db.json exista com a estrutura inicial
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(
    dbPath,
    JSON.stringify({ usuarios: [] }, null, 2),
    'utf-8'
  );
}

const server = jsonServer.create();
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults({
  static: path.join(__dirname, 'public')
});

// 1. Middlewares padrão do JSON-Server (CORS, logger e pasta /public)
server.use(middlewares);

// 2. Parser de JSON obrigatório para POST e PUT funcionarem no cadastro/edição
server.use(jsonServer.bodyParser);

// 3. Fallback caso algum arquivo esteja na raiz do projeto
server.use(express.static(__dirname));

// 4. Rota principal abrindo o index.html
server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 5. Rotas da API (/usuarios) — sempre por último
server.use(router);

// 6. Porta dinâmica (funciona no Render e localmente na porta 3000)
const porta = process.env.PORT || 3000;
server.listen(porta, () => {
  console.log(`Servidor Dertflix rodando em ${porta}`);
});

require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");

const app = express();

// ======================
// MIDDLEWARES
// ======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// ARQUIVOS ESTÁTICOS (HTML, CSS, JS)
// ======================
app.use(express.static(path.join(__dirname)));

// ======================
// CONEXÃO MYSQL
// ======================
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no MySQL:", err);
  } else {
    console.log("Conectado ao MySQL!");
  }
});

// ======================
// CRIAR CONTA
// ======================
app.post("/api/create-account", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: "Preencha todos os campos!" });
  }

  db.query(
    "SELECT id FROM usuarios WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) return res.json({ success: false });

      if (results.length > 0) {
        return res.json({ success: false, message: "Usuário já existe" });
      }

      const hash = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO usuarios (username, password_hash) VALUES (?, ?)",
        [username, hash],
        (err2) => {
          if (err2) return res.json({ success: false });
          return res.json({ success: true });
        }
      );
    }
  );
});

// ======================
// LOGIN
// ======================
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: "Preencha todos os campos!" });
  }

  db.query(
    "SELECT * FROM usuarios WHERE username = ?",
    [username],
    async (err, results) => {
      if (err || results.length === 0) {
        return res.json({ success: false });
      }

      const user = results[0];
      const match = await bcrypt.compare(password, user.password_hash);

      if (!match) {
        return res.json({ success: false });
      }

      return res.json({
        success: true,
        username: user.username,
        userId: user.id,
      });
    }
  );
});

// ======================
// SALVAR PONTUAÇÃO DO QUIZ
// ======================
app.post("/api/quiz/score", (req, res) => {
  const { username, pontos, apelido } = req.body;

  if (!username || apelido === undefined || pontos === undefined) {
    return res.json({ success: false, message: "Dados inválidos" });
  }

  const pontosInt = parseInt(pontos, 10);

  if (isNaN(pontosInt)) {
    return res.json({ success: false, message: "Pontuação inválida" });
  }

  db.query(
    "SELECT id FROM usuarios WHERE username = ?",
    [username],
    (err, results) => {
      if (err || results.length === 0) {
        return res.json({ success: false, message: "Usuário não encontrado" });
      }

      const usuarioId = results[0].id;

      db.query(
        "INSERT INTO pontuacoes (usuario_id, pontos, apelido) VALUES (?, ?, ?)",
        [usuarioId, pontosInt, apelido],
        (err2) => {
          if (err2) {
            console.error(err2);
            return res.json({ success: false });
          }

          return res.json({ success: true });
        }
      );
    }
  );
});

// ======================
// RANKING (TOP 10)
// ======================
app.get("/api/rank", (req, res) => {
  const sql = `
    SELECT 
      COALESCE(p.apelido, u.username) AS nome,
      p.pontos,
      p.data
    FROM pontuacoes p
    JOIN usuarios u ON u.id = p.usuario_id
    ORDER BY p.pontos DESC, p.data ASC
    LIMIT 10
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.json({ success: false });
    }

    return res.json({ success: true, ranking: results });
  });
});

// ======================
// ROTAS HTML (OPCIONAL, MAS LIMPO)
// ======================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/quiz", (req, res) => {
  res.sendFile(path.join(__dirname, "quiz", "quiz.html"));
});

app.get("/ranking", (req, res) => {
  res.sendFile(path.join(__dirname, "ranking", "ranking.html"));
});

// ======================
// PORTA
// ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor rodando na porta ${PORT} 🚀`)
);

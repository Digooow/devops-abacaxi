const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

// POST /auth/login  { usuario, senha }
router.post('/login', async (req, res) => {
  const { usuario, senha } = req.body;
  const user = await Usuario.findOne({ where: { usuario } });

  if (!user || !(await bcrypt.compare(senha || '', user.senha_hash))) {
    return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
  }

  const token = jwt.sign(
    { id: user.id, usuario: user.usuario },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
  return res.json({ token, usuario: user.usuario });
});

module.exports = router;

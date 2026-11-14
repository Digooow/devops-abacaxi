const router = require('express').Router();
const { Colheita } = require('../models');
const calcularEstoque = require('../estoque');

// GET /colheitas
router.get('/', async (req, res) => {
  const colheitas = await Colheita.findAll({ order: [['data', 'DESC'], ['id', 'DESC']] });
  res.json(colheitas);
});

// POST /colheitas  { data, quantidade, observacao }
router.post('/', async (req, res) => {
  const { data, quantidade, observacao } = req.body;
  const qtd = Number(quantidade);
  if (!data || !Number.isFinite(qtd) || qtd <= 0) {
    return res.status(400).json({ erro: 'Informe a data e uma quantidade maior que zero' });
  }
  const colheita = await Colheita.create({ data, quantidade: qtd, observacao });
  return res.status(201).json(colheita);
});

// DELETE /colheitas/:id
router.delete('/:id', async (req, res) => {
  const colheita = await Colheita.findByPk(req.params.id);
  if (!colheita) return res.status(404).json({ erro: 'Colheita não encontrada' });

  const { estoque } = await calcularEstoque();
  if (estoque - colheita.quantidade < 0) {
    return res.status(400).json({ erro: 'Não é possível excluir: os abacaxis desta colheita já foram vendidos' });
  }
  await colheita.destroy();
  return res.status(204).end();
});

module.exports = router;

const express = require('express');
const router = express.Router();

const { createTurn, getTurns, updateTurn, cancelTurn } = require('../controllers/turn.controller');
const { verifyAuth } = require('../middlewares/auth');




router.post('/', verifyAuth, createTurn);
router.get('/', verifyAuth, getTurns);
router.patch('/:id', verifyAuth, updateTurn);
router.patch('/:id/cancel', verifyAuth, cancelTurn);

module.exports = router;
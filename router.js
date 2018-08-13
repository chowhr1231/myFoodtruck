const express = require('express');
const router = express.Router();
const {boardList, createPage, createBoard} = require('./routes/CRUD/users');

router.get('/board', boardList);

router.get('/board/create', createPage);
router.post('/board/create', createBoard);

module.exports = router
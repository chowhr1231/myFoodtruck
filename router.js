const express = require('express');
const router = express.Router();
const {boardList} = require('./routes/users');

router.get('/board', boardList);

module.exports = router
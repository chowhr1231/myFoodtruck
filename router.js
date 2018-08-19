const express = require('express');
const router = express.Router();
const { boardList, createPage, createBoard, boardShow, modifyView, modify } = require('./routes/CRUD/users');

router.get('/board/:page', boardList);
router.get('/board/:page/:boardID', boardShow);

router.get('/create', createPage);
router.post('/create', createBoard);

router.get('/modify/:page/:boardID', modifyView);
router.post('/modify/:page/:boardID', modify);


module.exports = router
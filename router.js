const express = require('express');
const router = express.Router();
const { boardList, createPage, createBoard, boardShow, modifyView, modify, deleteBoard, googleMapView, googleMap} = require('./routes/CRUD/users');
const {passwordValid} = require('./routes/util');
const {test} = require('./routes/test');

router.get('/board/:page', boardList);
router.get('/board/:page/:boardID', boardShow);

router.get('/create', createPage);
router.post('/create', createBoard);

router.get('/modify/:page/:boardID', modifyView);
router.post('/modify/:page/:boardID', modify);

router.post('/delete/:boardID', deleteBoard);

router.post('/check/password', passwordValid);

router.get('/foodtruckMap', googleMapView);
router.post('/foodtruckMap', googleMap);


module.exports = router
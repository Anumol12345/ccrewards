const express = require('express');
const router = express.Router();
const cardController = require('../controllers/card');


router.post('/all', cardController.getAllCards);
router.post('/category', cardController.getAllCategory);
router.post('/category/:id', cardController.getCategoryById);
router.post('/filter', cardController.getCategory);
//router.post('/compare', cardController.getCompare);
router.post('/getCompare', cardController.getCompare);
router.post('/getBanks', cardController.getBanks);
router.post('/getBanks/:id', cardController.getCardsByBankId);
router.post('/saveProfile', cardController.saveProfile);
router.post('/getProfile', cardController.getProfile);
             


module.exports = router;
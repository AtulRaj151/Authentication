const express = require('express');
const  router = express.Router();

const homeController = require('../controllers/home');

router.get('/',homeController.home);
//using user controllers
router.use('/users',require('./users'));
console.log('router loaded')

module.exports = router;




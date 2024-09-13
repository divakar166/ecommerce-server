const express = require('express');
const { searchProducts, addToCart, removeFromCart, getCart, clearCart } = require('../controllers/buyerController');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/search', searchProducts);
router.get('/cart',verifyToken("buyer"), getCart);
router.post('/cart/add', verifyToken('buyer'), addToCart);
router.delete('/cart/:productId', verifyToken('buyer'), removeFromCart);
router.delete('/cart/clear',verifyToken("buyer"), clearCart);

module.exports = router;

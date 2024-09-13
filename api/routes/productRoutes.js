const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const { addProduct, editProduct, deleteProduct, getAllProducts } = require('../controllers/productController');

const router = express.Router();

// REST API Endpoints
router.get('/', getAllProducts);                  // Get all products
router.post('/', verifyToken('seller'), addProduct); // Add a new product (only for sellers)
router.put('/:id', verifyToken('seller'), editProduct);  // Edit an existing product (only for sellers)
router.delete('/:id', verifyToken('seller'), deleteProduct); // Delete a product (only for sellers)

module.exports = router;

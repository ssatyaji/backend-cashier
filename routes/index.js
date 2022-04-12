var router = express.Router();
import categories from './categories.js';
import products from './products.js';
import express from 'express';

router.use('/categories', categories);
router.use('/products', products);

export default router;

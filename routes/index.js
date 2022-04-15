var router = express.Router();
import categories from './categories.js';
import products from './products.js';
import auth from './auth.js';
import express from 'express';

router.use('/categories', categories);
router.use('/products', products);
router.use('/auth', auth);

export default router;

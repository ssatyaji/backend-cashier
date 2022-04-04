var router = express.Router();

import express from 'express';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });
});

export default router;

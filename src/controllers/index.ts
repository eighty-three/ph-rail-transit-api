import express from 'express';
const router = express.Router();

import getRoute from './shortestRoute';
router.get('/examplex', getRoute);

export default router;

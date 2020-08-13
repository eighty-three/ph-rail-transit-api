import express from 'express';
const router = express.Router();

import getRoute from './route';
import validateStationQuery from './route.schema';
router.get('/getRoute', validateStationQuery, getRoute);

export default router;

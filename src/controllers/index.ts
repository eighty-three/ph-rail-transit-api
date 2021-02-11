import express from 'express';
const router = express.Router();

import getRoute from './route';
import getStations from './stations';
import validateStationQuery from './route.schema';
router.get('/getRoute', validateStationQuery, getRoute);
router.get('/stations', getStations);

export default router;

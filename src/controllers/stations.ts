import { RequestHandler } from 'express';
import { getStations as _getStations } from '../models';

const getStations: RequestHandler = async (req, res) => {
  const stations = await _getStations();
  res.json({ stations });
};

export default getStations;

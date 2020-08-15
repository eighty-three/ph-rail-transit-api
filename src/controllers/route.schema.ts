import Joi from '@hapi/joi';
import { getStations } from '../models';
import { RequestHandler } from 'express';

const validateStationQuery: RequestHandler = async (req, res, next) => {
  const arr = await getStations();

  const routeSchema = Joi.object({
    start: Joi.string().valid(...arr).required(),
    end: Joi.string().valid(...arr).required()
  });

  const { error } = routeSchema.validate(req['query']);
  if (error == null) {
    next();
  } else {
    res.status(400).json({ error: 'Bad Request', statusCode: 400 });
  }
};

export default validateStationQuery;

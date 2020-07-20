import { RequestHandler } from 'express';
import { shortestRoute, map } from '../models';
import finalBoss from './finalBoss';

const getRoute: RequestHandler = async (req, res) => {
  console.log(req.query);
  const route = shortestRoute(map, 'E', 'XC');

  for (const key1 in map) {
    for (const key2 in map) {
      const shit1 = finalBoss(map, key1, key2);
      const shit2 = shortestRoute(map, key1, key2);

      if (shit1.distance !== shit2.distance) {
        console.log(shit1);
        console.log(key1);
        console.log(shit2);
        console.log(key2);
        console.log('-------------');
      }
    }
  }

  res.json({ path: route.paths, distance: route.distance });
};

export default getRoute;

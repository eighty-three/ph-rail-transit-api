import { RequestHandler } from 'express';
import { shortestRoute, getMap, checkStation } from '../models';
import { IGraph } from './route.types';

const getRoute: RequestHandler = async (req, res) => {
  const start: string = req.query.start as string;
  const end: string = req.query.end as string;
  const startStationInfo = await checkStation(start); // should return branch_id, distance_to_branch_start, distance_to_branch_end, branch_start, branch_end
  const endStationInfo = await checkStation(end); // or returns nothing if intersection
  const map: IGraph = getMap();

  if (startStationInfo && endStationInfo && startStationInfo.branch_id === endStationInfo.branch_id) { // if queried stations are in the same branch
    /* If TAYUMAN to BAMBANG
     * TAYUMAN: {BAMBANG: someDistance}
     * BAMBANG: {TAYUMAN: someDistance}
     * delete map['DJOSE_RECTO]['ROOSEVELT']
     * delete map['ROOSEVELT']['DJOSE_RECTO']
     */ 
    const distance = Math.abs(startStationInfo.distance_to_branch_start - endStationInfo.distance_to_branch_start);
    map[start] = {[end]: distance};
    map[end] = {[start]: distance};
                                    
    delete map[startStationInfo.branch_start][startStationInfo.branch_end];
    delete map[startStationInfo.branch_end][startStationInfo.branch_start];

    if (startStationInfo.distance_to_branch_start > endStationInfo.distance_to_branch_start) {
      // if queried stations are in the same branch, and `end` is closer to `branch_start`
      map[end][endStationInfo.branch_start] = endStationInfo.distance_to_branch_start;
      map[endStationInfo.branch_start][end] = endStationInfo.distance_to_branch_start;

      map[start][startStationInfo.branch_end] = startStationInfo.distance_to_branch_end;
      map[startStationInfo.branch_end][start] = startStationInfo.distance_to_branch_end;

    } else {
      // if queried stations are in the same branch, and `start` is closer to `branch_start`
      map[start][startStationInfo.branch_start] = startStationInfo.distance_to_branch_start;
      map[startStationInfo.branch_start][start] = startStationInfo.distance_to_branch_start;

      map[endStationInfo.branch_end][end] = endStationInfo.distance_to_branch_end;
      map[end][endStationInfo.branch_end] = endStationInfo.distance_to_branch_end;
    }
  } else { // else if queried stations are not in the same branch
    if (startStationInfo) { // if not intersection, then fix map
      /* If TAYUMAN to MAGALLANES:
       * delete map['DJOSE_RECTO']['ROOSEVELT']
       * delete map['ROOSEVELT']['DJOSE_RECTO']
       * TAYUMAN: {DJOSE_RECTO: someDistance, ROOSEVELT: someDistance}
       * DJOSE_RECTO: {TAYUMAN: someDistance}
       * ROOSEVELT: {TAYUMAN: someDistance}
       */
      delete map[startStationInfo.branch_start][startStationInfo.branch_end];
      delete map[startStationInfo.branch_end][startStationInfo.branch_start];
      map[start] = {
        [startStationInfo.branch_start]: startStationInfo.distance_to_branch_start,
        [startStationInfo.branch_end]: startStationInfo.distance_to_branch_end
      };

      map[startStationInfo.branch_start][start] = startStationInfo.distance_to_branch_start;
      map[startStationInfo.branch_end][start] = startStationInfo.distance_to_branch_end;
    }

    if (endStationInfo) { // same as previous example but with MAGALLANES and its specific info this time
      delete map[endStationInfo.branch_start][endStationInfo.branch_end];
      delete map[endStationInfo.branch_end][endStationInfo.branch_start];
      map[end] = {
        [endStationInfo.branch_start]: endStationInfo.distance_to_branch_start,
        [endStationInfo.branch_end]: endStationInfo.distance_to_branch_end
      };

      map[endStationInfo.branch_start][end] = endStationInfo.distance_to_branch_start;
      map[endStationInfo.branch_end][end] = endStationInfo.distance_to_branch_end;
    }
  }

  const route = shortestRoute(map, start, end);
  res.json({ path: route.paths, distance: route.distance });
};

export default getRoute;

import { RequestHandler } from 'express';
import { shortestRoute, getMap, checkStation } from '../models';

interface IGraph {
  [key: string]: {
    [key: string]: number
  }
}

const getRoute: RequestHandler = async (req, res) => {
  const start: string = req.query.start as string;
  const end: string = req.query.end as string;
  const startStationBranch = await checkStation(start); // should return branch_id, distance_to_branch_start, distance_to_branch_end, branch_start, branch_end
  const endStationBranch = await checkStation(end); // or returns nothing if intersection
  const map: IGraph = getMap();

  if (startStationBranch && startStationBranch.branch_id === endStationBranch.branch_id) { // if queried stations are in the same branch
    /* If TAYUMAN to BAMBANG
     * TAYUMAN: {BAMBANG: someDistance}
     * BAMBANG: {TAYUMAN: someDistance}
     * delete map['DJOSE_RECTO]['ROOSEVELT']
     * delete map['ROOSEVELT']['DJOSE_RECTO']
     */ 
    const distance = Math.abs(startStationBranch.distance_to_branch_start - endStationBranch.distance_to_branch_start);
    map[start] = {[end]: distance};
    map[end] = {[start]: distance};
                                    
    delete map[startStationBranch.branch_start][startStationBranch.branch_end];
    delete map[startStationBranch.branch_end][startStationBranch.branch_start];

    if (startStationBranch.distance_to_branch_start > endStationBranch.distance_to_branch_start) {
      // if queried stations are in the same branch, and `end` is closer to `branch_start`
      map[end][endStationBranch.branch_start] = endStationBranch.distance_to_branch_start;
      map[endStationBranch.branch_start][end] = endStationBranch.distance_to_branch_start;

      map[start][startStationBranch.branch_end] = startStationBranch.distance_to_branch_end;
      map[startStationBranch.branch_end][start] = startStationBranch.distance_to_branch_end;

    } else {
      // if queried stations are in the same branch, and `start` is closer to `branch_start`
      map[start][startStationBranch.branch_start] = startStationBranch.distance_to_branch_start;
      map[startStationBranch.branch_start][start] = startStationBranch.distance_to_branch_start;

      map[endStationBranch.branch_end][end] = endStationBranch.distance_to_branch_end;
      map[end][endStationBranch.branch_end] = endStationBranch.distance_to_branch_end;
    }
  } else { // else if queried stations are not in the same branch
    if (startStationBranch) { // if not intersection, then fix map
      /* If TAYUMAN to MAGALLANES:
       * delete map['DJOSE_RECTO']['ROOSEVELT']
       * delete map['ROOSEVELT']['DJOSE_RECTO']
       * TAYUMAN: {DJOSE_RECTO: someDistance, ROOSEVELT: someDistance}
       * DJOSE_RECTO: {TAYUMAN: someDistance}
       * ROOSEVELT: {TAYUMAN: someDistance}
       */
      delete map[startStationBranch.branch_start][startStationBranch.branch_end];
      delete map[startStationBranch.branch_end][startStationBranch.branch_start];
      map[start] = {
        [startStationBranch.branch_start]: startStationBranch.distance_to_branch_start,
        [startStationBranch.branch_end]: startStationBranch.distance_to_branch_end
      };

      map[startStationBranch.branch_start][start] = startStationBranch.distance_to_branch_start;
      map[startStationBranch.branch_end][start] = startStationBranch.distance_to_branch_end;
    }

    if (endStationBranch) { // same as previous example but with MAGALLANES and its specific info this time
      delete map[endStationBranch.branch_start][endStationBranch.branch_end];
      delete map[endStationBranch.branch_end][endStationBranch.branch_start];
      map[end] = {
        [endStationBranch.branch_start]: endStationBranch.distance_to_branch_start,
        [endStationBranch.branch_end]: endStationBranch.distance_to_branch_end
      };

      map[endStationBranch.branch_start][end] = endStationBranch.distance_to_branch_start;
      map[endStationBranch.branch_end][end] = endStationBranch.distance_to_branch_end;
    }
  }

  const route = shortestRoute(map, start, end);
  res.json({ path: route.paths, distance: route.distance });
};

export default getRoute;

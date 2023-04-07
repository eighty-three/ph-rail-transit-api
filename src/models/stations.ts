import db from './db';
import { IStationInfo } from './stations.types';
const stationsTable = 'stations';
const stationBranchTable = 'station_branch';
const branchesTable = 'branches';


export const checkStation = async (stationName: string): Promise<IStationInfo|null> => {
  return await db.oneOrNone( 
    'SELECT sb.branch_id, distance_to_branch_start, distance_to_branch_end, branch_start, branch_end from $2:alias s \
    INNER JOIN $3:alias sb ON sb.station_id = s.station_id \
    INNER JOIN $4:alias b ON sb.branch_id = b.branch_id WHERE station_name=$1 \
    ', [stationName, stationsTable, stationBranchTable, branchesTable]
  );
};

export const getStations = async (): Promise<string[]> => {
  const arr = await db.many(
    'SELECT (station_name) FROM $1:name', [stationsTable]
  );

  return arr.map((station) => station.station_name);
};

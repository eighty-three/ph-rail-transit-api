import * as stations from './stations';

describe('for checking station', () => {
  test('should return null because station doesn\'t exist', async () => {
    const station = await stations.checkStation('not_a_station');
    expect(station).toStrictEqual(null);
  });

  test('should return null because intersection', async () => {
    const station = await stations.checkStation('EDSA_TAFT');
    expect(station).toStrictEqual(null);
  });

  test('should return station info', async () => {
    const station = await stations.checkStation('LIBERTAD');
    expect(station).toStrictEqual({
      branch_id: 2,
      distance_to_branch_start: 1.01,
      distance_to_branch_end: 6.79,
      branch_start: 'EDSA_TAFT',
      branch_end: 'DJOSE_RECTO'
    });
  });
});

describe('for getting all stations', () => {
  test('should return correct number of stations', async () => {
    const stationsList = await stations.getStations();
    expect(stationsList.length).toStrictEqual(41);
  });

  test('should correct stations', async () => {
    const stationsList = await stations.getStations();
    expect(stationsList).toEqual(expect.arrayContaining(['LIBERTAD', 'MAGALLANES', 'KAMUNING', 'VMAPA', 'BALINTAWAK']));
  });
});

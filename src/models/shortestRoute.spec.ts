import shortestRoute from './shortestRoute';

const basicMap = {	
  A: {B: 1},
  B: {A: 1, C: 1},	
  C: {B: 1, D: 1},
  D: {C: 1},
};

describe('testing the basics to make sure it at least works', () => {
  test('adjacent stations', async () => {
    const stationsList = shortestRoute(basicMap, 'A', 'B');
    expect(stationsList).toStrictEqual({
      paths: ['A', 'B'], 
      distance: 1
    });
  });

  test('adjacent stations in reverse, should return correct order', async () => {
    const stationsList = shortestRoute(basicMap, 'B', 'A');
    expect(stationsList).toStrictEqual({
      paths: ['B', 'A'], 
      distance: 1
    });
  });

  test('same station', async () => {
    const stationsList = shortestRoute(basicMap, 'A', 'A');
    expect(stationsList).toStrictEqual({
      paths: ['A'], 
      distance: 0
    });
  });

  test('testing stations far apart in a straight line', async () => {
    const stationsList = shortestRoute(basicMap, 'A', 'D');
    expect(stationsList).toStrictEqual({
      paths: ['A', 'B', 'C', 'D'], 
      distance: 3
    });
  });
});


describe('testing some cases with pathfinding', () => {
  test('two paths, path with fewer nodes is shorter', async () => {
    const map = {	
      A: {B: 1, E: 1},
      B: {A: 1, C: 1},	
      C: {B: 1, D: 1},
      D: {C: 1, E: 1},
      E: {A: 1, D: 1}
    };

    const stationsList = shortestRoute(map, 'A', 'D');
    expect(stationsList).toStrictEqual({
      paths: ['A', 'E', 'D'], 
      distance: 2
    });
  });

  test('two paths, path with fewer nodes is longer', async () => {
    const map = {	
      A: {B: 1, E: 5},
      B: {A: 1, C: 1},	
      C: {B: 1, D: 1},
      D: {C: 1, E: 5},
      E: {A: 5, D: 5}
    };

    const stationsList = shortestRoute(map, 'A', 'D');
    expect(stationsList).toStrictEqual({
      paths: ['A', 'B', 'C', 'D'], 
      distance: 3
    });
  });

  test('three paths, path with fewer nodes is shorter', async () => {
    const map = {	
      A: {B: 1, E: 1, F: 2},
      B: {A: 1, C: 1},	
      C: {B: 1, D: 1},
      D: {C: 1, E: 1, F: 2},
      E: {A: 1, D: 1},
      F: {A: 2, D: 2}
    };

    const stationsList = shortestRoute(map, 'A', 'D');
    expect(stationsList).toStrictEqual({
      paths: ['A', 'E', 'D'], 
      distance: 2
    });
  });

  test('three paths, path with fewer nodes is longer', async () => {
    const map = {	
      A: {B: 1, E: 5, F: 6},
      B: {A: 1, C: 1},	
      C: {B: 1, D: 1},
      D: {C: 1, E: 5, F: 6},
      E: {A: 5, D: 5},
      F: {A: 6, D: 6}
    };

    const stationsList = shortestRoute(map, 'A', 'D');
    expect(stationsList).toStrictEqual({
      paths: ['A', 'B', 'C', 'D'], 
      distance: 3
    });
  });

  test('two paths, same distance', async () => {
    const map = {	
      A: {B: 1, E: 3},
      B: {A: 1, C: 1},	
      C: {B: 1, D: 1},
      D: {C: 1, E: 1},
      E: {A: 1, D: 1}
    };

    const stationsList = shortestRoute(map, 'A', 'D');
    expect(stationsList).toStrictEqual({
      paths: ['A', 'B', 'C', 'D'], 
      distance: 3
    });
  });

  test('two paths with same distance, converging into one node before target node', async () => {
    const map = {	
      A: {B: 1, C: 1},
      B: {A: 1, D: 1},	
      C: {A: 1, D: 1},
      D: {B: 1, C: 1, E: 1},
      E: {D: 1}
    };

    const stationsList = shortestRoute(map, 'A', 'E');
    expect(stationsList).toStrictEqual({
      paths: ['A', 'B', 'D', 'E'], 
      distance: 3
    });
  });

  test('two paths with different distances, converging into one node before target node', async () => {
    const map = {	
      A: {B: 1, C: 2},
      B: {A: 1, D: 1},	
      C: {A: 2, D: 1},
      D: {B: 1, C: 1, E: 1},
      E: {D: 1}
    };

    const stationsList = shortestRoute(map, 'A', 'E');
    expect(stationsList).toStrictEqual({
      paths: ['A', 'B', 'D', 'E'], 
      distance: 3
    });
  });

  test('two paths with different distances and node count, fewer node path is longer, converging into one node before target node', async () => {
    const map = {	
      A: {B: 3, F: 1},
      B: {A: 3, C: 1},
      C: {B: 1, D: 1},
      D: {C: 1, E: 1},
      E: {D: 1, G: 1, H: 1},
      F: {A: 1, G: 5},
      G: {F: 5, E: 1},
      H: {E: 1}
    };

    const stationsList = shortestRoute(map, 'A', 'H');
    expect(stationsList).toStrictEqual({
      paths: ['A', 'B', 'C', 'D', 'E', 'H'], 
      distance: 7
    });
  });

  test('two paths with different distances and node count, fewer node path is shorter, converging into one node before target node', async () => {
    const map = {	
      A: {B: 5, F: 1},
      B: {A: 5, C: 1},
      C: {B: 1, D: 1},
      D: {C: 1, E: 1},
      E: {D: 1, G: 1, H: 1},
      F: {A: 1, G: 5},
      G: {F: 5, E: 1},
      H: {E: 1}
    };

    const stationsList = shortestRoute(map, 'A', 'H');
    expect(stationsList).toStrictEqual({
      paths: ['A', 'F', 'G', 'E', 'H'], 
      distance: 8
    });
  });

  test('start is adjacent to target but shorter route exists, aka why a sort is necessary', async () => {
    const map = {
      A: {B: 5, C: 1},
      C: {A: 1, D: 1},
      D: {C: 1, E: 1},
      E: {D: 1, B: 1},
      B: {A: 5, E: 1}
    };

    const stationsList = shortestRoute(map, 'A', 'B');
    expect(stationsList).toStrictEqual({
      paths: ['A', 'C', 'D', 'E', 'B'], 
      distance: 4
    });
  });

  test('start is adjacent to target and is shortest route', async () => {
    const map = {
      A: {B: 3, C: 1},
      C: {A: 1, D: 1},
      D: {C: 1, E: 1},
      E: {D: 1, B: 1},
      B: {A: 3, E: 1}
    };

    const stationsList = shortestRoute(map, 'A', 'B');
    expect(stationsList).toStrictEqual({
      paths: ['A', 'B'], 
      distance: 3
    });
  });
});


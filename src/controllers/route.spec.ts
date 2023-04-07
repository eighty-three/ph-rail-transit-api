import request from 'supertest';
import http from 'http';
import app from '../app';
const server = http.createServer(app).listen(8090); // Different port for tests
const url = '/api/getRoute';

afterAll(async () => {
  server.close();
});

describe('for getRoute', () => {
  test('getting route with a non-existent station', async () => {
    const res = await request(server).get(url).query({start: 'TAYUMAN', end: 'LIBERTAD123'});
    expect(res.body).toEqual({
      error: 'Bad Request',
      statusCode: 400
    });
  });

  test('getting route between two non-intersections', async () => {
    const res = await request(server).get(url).query({start: 'TAYUMAN', end: 'LIBERTAD'});
    expect(res.body).toEqual({
      path: ['TAYUMAN', 'DJOSE_RECTO', 'LIBERTAD'], 
      distance: 8.04
    });
  });

  test('getting route between two non-intersections across map', async () => {
    const res = await request(server).get(url).query({start: 'LIBERTAD', end: 'QUEZONAVE'});
    expect(res.body).toEqual({
      path: ['LIBERTAD', 'EDSA_TAFT', 'ARANETA_CUBAO', 'QUEZONAVE'], 
      distance: 16.51
    });
  });

  test('getting route between two adjacent intersections', async () => {
    const res = await request(server).get(url).query({start: 'DJOSE_RECTO', end: 'EDSA_TAFT'});
    expect(res.body).toEqual({
      path: ['DJOSE_RECTO', 'EDSA_TAFT'], 
      distance: 7.8
    });
  });

  test('getting route between two non-adjacent intersections', async () => {
    const res = await request(server).get(url).query({start: 'EDSA_TAFT', end: 'ROOSEVELT'});
    expect(res.body).toEqual({
      path: ['EDSA_TAFT', 'DJOSE_RECTO', 'ROOSEVELT'], 
      distance: 17.45
    });
  });

  test('getting route between two non-intersections in same branch', async () => {
    const res = await request(server).get(url).query({start: 'TAYUMAN', end: 'BALINTAWAK'});
    expect(res.body).toEqual({
      path: ['TAYUMAN', 'BALINTAWAK'], 
      distance: 6.53
    });
  });

  test('getting route between two non-intersections in same branch reversed', async () => {
    const res = await request(server).get(url).query({start: '5THAVENUE', end: 'BAMBANG'});
    expect(res.body).toEqual({
      path: ['5THAVENUE', 'BAMBANG'], 
      distance: 3.81
    });
  });

  test('getting route between an intersection and another station', async () => {
    const res = await request(server).get(url).query({start: 'ARANETA_CUBAO', end: 'BALINTAWAK'});
    expect(res.body).toEqual({
      path: ['ARANETA_CUBAO', 'NORTHAVE', 'ROOSEVELT', 'BALINTAWAK'], 
      distance: 7.97
    });
  });

  test('getting route between an intersection and another station in same branch', async () => {
    const res = await request(server).get(url).query({start: 'ARANETA_CUBAO', end: 'VMAPA'});
    expect(res.body).toEqual({
      path: ['ARANETA_CUBAO', 'VMAPA'], 
      distance: 4.38
    });
  });
});

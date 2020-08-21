import { IGraph, IResult } from './shortestRoute.types';

const shortestRoute = (graph: IGraph, start: string, end: string): IResult => {
  const distance: { [key: string]: number } = {};
  const paths: { [key: string]: string } = {};
  const visited: string[] = [];
  const queue: string[] = [];

  for (const node in graph) {
    (node === start)
      ? distance[node] =  0
      : distance[node] = Infinity;
  }

  let currentNode: string|undefined = start;
  while (currentNode) {
    for (const neighbor in graph[currentNode]) {
      if (!visited.includes(neighbor)) {
        /* If the neighbor still hasn't been visited, that is,
         * its final value still isn't set, then continue the loop
         */

        const totalDistance = distance[currentNode] + graph[currentNode][neighbor];
        if (distance[neighbor] > totalDistance) {
          /* If the neighbor's distance value is higher than `totalDistance`
           * then it means a shorter route to it has been found
           */

          distance[neighbor] = totalDistance;
          paths[neighbor] = currentNode;
          queue.push(neighbor);
        }
      }
    }

    queue.sort((a, b) => {
      return distance[a] - distance[b];
    });

    /* A sort is included so that the next node will always
     * be the node with the lowest distance value because if:
     * A: 10, B: 20, C: 50, START, where
     * START is adjacent to A and C
     * A to B
     * B to C
     * If the queue starts with C, after processing it, 
     * it will get marked as visited even if a shorter route
     * to it is possible (START -> A -> B -> C = 30)
     */ 
    if (currentNode !== end) visited.push(currentNode);
    currentNode = queue.shift();
  }

  const endPath: string[] = [];
  let track = end;

  while (track) { // Get the complete route by backtracking
    if (paths[track]) endPath.push(paths[track]);
    track = paths[track];
  }
  
  const roundedDistance = Math.round((distance[end] + Number.EPSILON) * 100)/100;

  return {distance: roundedDistance, paths: endPath.reverse().concat(end)};
};

export default shortestRoute;

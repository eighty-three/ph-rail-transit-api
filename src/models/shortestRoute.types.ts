export interface IGraph {
  [key: string]: {
    [key: string]: number
  }
}

export interface IResult {
  distance: number,
  paths: string[]
}

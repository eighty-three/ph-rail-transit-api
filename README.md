# PH Rail Transit API
An API that shows you the fastest route between two given stations (no frontend yet)

Created 2020, removed commits due to credentials issue

This project is my attempt at applying Dijkstra's algorithm to a problem. Its purpose is solely that so updates shouldn't be expected. However, I at least tried to understand how to make it "scalable" both in the sense that it should be easy to add new stations if ever necessary, and of course with regards to its efficiency.

I tried this implementation instead of just running Dijkstra through the raw dataset because I wanted to figure out a way of optimizing it. Considering the way rail transits work, since they rarely change directions except on stations where you can go to a different line, I tried treating them as one `edge`, where the `vertex` would be the stations mentioned. This way, instead of querying the database to get the information of 41 train stations, in this specific situation, you'd only need to get 7 branches (that I just hardcoded in this project, see `map.ts`), and the information (to fix the adjacency list/`graph`) of the two queried stations.

The problem is that while this process may ultimately be faster, updating the data would relatively be a massive headache. For example, let's say a new line that crosses Pedro Gil is created. You'd need to update the members of the previous branch `EDSA to D. Jose` and the distances of the stations inside that branch. It's easily doable programatically by substracting the `distance of Pedro Gil to branch end (D. Jose)` to each of the stations spanning EDSA to Pedro Gil, while doing the same for the new edge `Pedro Gil to D. Jose`. Afterwards, you'd also need to fix the values of the adjacency list, because a new `vertex` is created. I'd have to update some columns (`distance_to_branch_start`, `distance_to_branch_end`, `branch_start`, and `branch_end`?) of each of the stations affected (although if we're being honest I'd really just have to rerun the `populate.sh` script after fixing some values). However, compare all of that to simply adding new stations to the table, and having to fix the value of just one station for the adjacency list (in this case, Pedro Gil).

Regardless, I haven't really tested what's faster/more efficient. Like I've mentioned in the beginning, the goal is to apply or make use of Dijkstra's algorithm.
Going back, with regards to being "scalable", all things considered, it really isn't an obstacle given the current rate of development of rail transits in the Philippines. I am pretty sure I can update the database manually; I'd just have to spend some 10 minutes every 7 years or so.

## Usage
Since I haven't made a half-decent frontend just yet, you'll just have to query the API like so:
```
getRoute?start=${STARTSTATION}&end=${ENDSTATION}

e.g. https://eighty-three.dev/api/railTransit/getRoute?start=BALINTAWAK&end=GUADALUPE
```
Check the [page](https://eighty-three.dev/projects/ph-rail-transit-api/) or the [repo](database/stations_list) for the list of stations

## Tables

```
CREATE TABLE stations (
station_id SERIAL PRIMARY KEY,
station_name TEXT NOT NULL UNIQUE
);

CREATE TABLE branches (
branch_id SERIAL PRIMARY KEY,
branch_start TEXT NOT NULL,
branch_end TEXT NOT NULL
);

CREATE TABLE station_branch (
station_id INT REFERENCES stations(station_id) PRIMARY KEY NOT NULL,
branch_id INT REFERENCES branches(branch_id),
distance_to_branch_start REAL,
distance_to_branch_end REAL
);
```

#!/bin/bash
#I named it "populate" but I'd still need to copy the output into a terminal connected to the database. 
rm stations_to_database;
rm distances/distances_to_database;
while read station; do
  echo "INSERT INTO stations (station_name) VALUES ('$station');" >> stations_to_database
done <stations_list
num=0

while read branch_info; do
  branch_num=$(echo $branch_info | awk -F', ' '{print $1}')
  first_station_distance_to_branch_end=$(echo $branch_info | awk -F', ' '{print $2}')
  first_station_distance_to_branch_start=$(echo $branch_info | awk -F', ' '{print $3}')
  while read distance_to_branch_end; do
    num=$((num+1))
    distance_to_branch_start=$(echo \
    "$first_station_distance_to_branch_end \
    - $distance_to_branch_end \
    + $first_station_distance_to_branch_start" | bc -l)

    echo "INSERT INTO station_branch (station_id, branch_id, distance_to_branch_start, distance_to_branch_end) VALUES ('$num', '$branch_num', '$distance_to_branch_start', '$distance_to_branch_end');" >> distances/distances_to_database
  done <"distances/branch${branch_num}"
done <distances/branches


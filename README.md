# Fun project - AI driven path finder

## Current Progress & features

* Darth vader finds all R2D2 in shortest path using greedy search.
  - It turns out I need to use different search algorithms depends on shape of maps.
  - in a maze, I was unable to use some of well known search algos like A*. 
  - My current strategy is the following. 
  1. Find neighbors. 
  2. for each neighbors, search all the way down to leaf nodes to find all R2D2, when the node is in deadlock,
     sum total path all the way to start point.
  3. find which neighbor I need to select and go based on sum value -> shortest first
  
  It is basically the same mechanism as how depth first search works. but instead of choosing the next neighbor randomly,
  it finds out which way is the best to go among the neighbors to minimize the Darth vader's total moves

![Screenshot](/public/screenshot/04_02_2020.gif)

## Goal of the project
* Able to add enemies on the map
* Enemies automatically try to catch the mando
* The mando avoids enemies and find all baby yodas ( currently Darth vader finds R2D2s )
* Reinforcement learning will be written in Rust, compile it to web assembly and use it in browser

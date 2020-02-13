# Fun project - AI driven path finder

## Current Progress & features

* The mando finds all R2D2 in shortest path using greedy search algorithm.

  The same mechanism as how depth first search works. but instead of choosing the next neighbor randomly,
  it finds out which way is the best to go among the neighbors to minimize moves.

![Screenshot](/public/screenshot/13_02_2020.gif)

## Goal of the project
* Able to switch map between the maze and pacman map
* Able to select search algorithms
* Able to add enemies on the map
* Enemies automatically try to catch the mando
* The mando avoids enemies and find all R2D2
* Implement reinforcement learning in Rust and use it in browser

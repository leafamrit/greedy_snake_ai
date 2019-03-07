## Greedy Snake AI (1-step lookahead)
Based off https://arkeyve.github.io/snake_game, a greedy snake that looks one step ahead and moves to the apple while saving itself.

+ At every step, looks 1 step into the future to see if it is approaching the apple while not colliding with itself.
+ Will only die if all possible directions result in collision, which can happen very frequently once the snake gets long enough.
+ On loading, user is presented with a prompt to mention number of iterations are to be run (default value is 5)
+ After all iterations are complete, a file is downloaded with an array of all the scores received in every iteration.
+ Since the array is stored in browser memory before being downloaded, the maximum number of iterations is limited by the memory limitations of the browser.

If you want to play the game, or use the original game to write your own algorithm to play snake, head to https://github.com/Arkeyve/snake_game

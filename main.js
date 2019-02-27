window.onload = function() {
    var iter = 0;
    var itermax;
    var scores = [];

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var unit = 10;
    var xCells = canvas.width / unit;
    var yCells = canvas.height / unit;
    var snake;
    var apple;
    var direction = "R";
    var scoreboard = document.getElementById("score");

    function reset() {
        snake = [{
            x: xCells / 2,
            y: yCells / 2,
        }];
        apple = {
            x: Math.floor(Math.random() * xCells),
            y: Math.floor(Math.random() * yCells)
        };
    }

    document.addEventListener("keydown", function(e) {
        var dir = e.keyCode;
        if(dir === 37 && direction != "R") {
            direction = "L";
        } else if(dir === 38 && direction != "D") {
            direction = "U";
        } else if(dir === 39 && direction != "L") {
            direction = "R";
        } else if(dir === 40 && direction != "U") {
            direction = "D";
        }
    });

    function moveSnake() {
        if(direction === "L") {
            snake.unshift({
                x: snake[0].x - 1,
                y: snake[0].y
            });
        } else if(direction === "U") {
            snake.unshift({
                x: snake[0].x,
                y: snake[0].y - 1
            });
        } else if(direction === "R") {
            snake.unshift({
                x: snake[0].x + 1,
                y: snake[0].y
            });
        } else if(direction === "D") {
            snake.unshift({
                x: snake[0].x,
                y: snake[0].y + 1
            });
        }
    }

    function collision() {
        // collision with apple
        if(snake[0].x === apple.x && snake[0].y === apple.y) {
            return "A";
        }

        if(snake[0].x >= xCells || snake[0].x < 0 || snake[0].y >= yCells || snake[0].y < 0) {
            return "S";
        }

        for(var i = 1; i < snake.length; i++) {
            if(snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
                return "S";
            }
        }
    }

    function ghostStep(dir) {
        if(dir === "L") {
            return {
                x: snake[0].x - 1,
                y: snake[0].y
            };
        } else if(dir === "U") {
            return {
                x: snake[0].x,
                y: snake[0].y - 1
            };
        } else if(dir === "R") {
            return {
                x: snake[0].x + 1,
                y: snake[0].y
            };
        } else if(dir === "D") {
            return {
                x: snake[0].x,
                y: snake[0].y + 1
            };
        }
    }

    function ghostCollision(ghostHead) {
        if(ghostHead.x >= xCells || ghostHead.x < 0 || ghostHead.y >= yCells || ghostHead.y < 0) {
            return true;
        }

        for(i in snake) {
            if(ghostHead.x === snake[i].x && ghostHead.y === snake[i].y) {
                return true;
            }
        }

        return false;
    }

    function decideNextMove() {
        var tempDirection;
        if(apple.x > snake[0].x) {
            tempDirection = "R";
        } else if(apple.x < snake[0].x) {
            tempDirection = "L";
        } else if(apple.y > snake[0].y) {
            tempDirection = "D";
        } else if(apple.y < snake[0].y) {
            tempDirection = "U";
        }

        var ghostSnakeHead = ghostStep(tempDirection);
        if(ghostCollision(ghostSnakeHead)) {
            var remDirections = ["U", "D", "L", "R"];
            remDirections.splice(remDirections.indexOf(tempDirection), 1);
            remDirections.forEach(function(remDir) {
                if(!ghostCollision(ghostStep(remDir))) {
                    direction = remDir;
                }
            });
        } else {
            direction = tempDirection;
        }
    }

    function stopGame() {
        clearInterval(loop);
        setInterval(function() {
            ctx.fillStyle = "#f00";
            ctx.fillRect(snake[1].x * unit, snake[1].y * unit, unit, unit);
            setTimeout(function() {
                ctx.fillStyle = "#fff";
                ctx.fillRect(snake[1].x * unit, snake[1].y * unit, unit, unit);
            }, 200);
        }, 300);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // draw background
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // draw apple
        ctx.fillStyle = "#f00";
        ctx.fillRect(apple.x * unit, apple.y * unit, unit, unit);
        // draw snake
        ctx.fillStyle = "#fff";
        for(i in snake) {
            ctx.fillRect(snake[i].x * unit, snake[i].y * unit, unit, unit);
        }
        moveSnake();
        if(collision() === "S") {
            if(iter < itermax - 1) {
                scores.push(Number.parseInt(scoreboard.value));
                iter++;
                reset();
            } else {
                scores.push(Number.parseInt(scoreboard.value));
                var file = new Blob([scores.toString()], {type: 'text/plain'});
                var a = document.createElement("a");
                var url = URL.createObjectURL(file);
                a.href = url;
                a.download = itermax + "_scores_run_" + (new Date()).getTime() + ".txt";
                document.body.appendChild(a);
                a.click();
                setTimeout(function() {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
                stopGame();
            }
        } else if(collision() === "A") {
            apple = {
                x: Math.floor(Math.random() * xCells),
                y: Math.floor(Math.random() * yCells)
            };
        } else {
            snake.pop();
            scoreboard.value = snake.length - 1;
        }
        decideNextMove();
    }

    var promtedVal = Number.parseInt(prompt("Number of iterations (default: 5): "));
    itermax = promtedVal > 0 ? promtedVal : 5;
    reset();
    var loop = setInterval(draw, 0);
};

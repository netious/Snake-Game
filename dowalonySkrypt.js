document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const resetButton = document.getElementById("resetButton");
    const scoreDisplay = document.getElementById("score");
    const levelDisplay = document.getElementById("level");

    canvas.width = 600;
    canvas.height = 400;

    let snake = [{ x: 100, y: 100 }, { x: 80, y: 100 }, { x: 60, y: 100 }];
    let direction = "Right";
    let food = { x: 200, y: 200 };
    let score = 0;
    let level = 1;
    let speed = 150;
    let isGameRunning = false;
    let gameInterval;

    function drawSnake() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snake.forEach(segment => {
            ctx.fillStyle = "green";
            ctx.fillRect(segment.x, segment.y, 20, 20);
        });
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(food.x + 10, food.y + 10, 10, 0, Math.PI * 2);
        ctx.fill();
    }

    function moveSnake() {
        const head = { ...snake[0] };

        switch (direction) {
            case "Up": head.y -= 20; break;
            case "Down": head.y += 20; break;
            case "Left": head.x -= 20; break;
            case "Right": head.x += 20; break;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            if (score % 100 === 0) {
                level++;
                levelDisplay.textContent = level;
                speed = Math.max(50, speed - 10); 
                clearInterval(gameInterval);
                gameInterval = setInterval(moveSnake, speed);
            }
            scoreDisplay.textContent = score;
            food = spawnFood();
        } else {
            snake.pop();
        }

        if (checkCollision()) {
            gameOver();
            return;
        }

        drawSnake();
    }

    function checkCollision() {
        const head = snake[0];
        const collidedWithBody = snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
        const outOfBounds = head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height;
        return collidedWithBody || outOfBounds;
    }

    function spawnFood() {
        let x, y;
        do {
            x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
            y = Math.floor(Math.random() * (canvas.height / 20)) * 20;
        } while (snake.some(segment => segment.x === x && segment.y === y));
        return { x, y };
    }

    function changeDirection(event) {
        const newDirection = event.key.replace("Arrow", "");
        const isValidChange = (newDirection === "Up" && direction !== "Down") ||
            (newDirection === "Down" && direction !== "Up") ||
            (newDirection === "Left" && direction !== "Right") ||
            (newDirection === "Right" && direction !== "Left");

        if (isValidChange) direction = newDirection;
    }

    function resetGame() {
        if (isGameRunning) clearInterval(gameInterval);
        snake = [{ x: 100, y: 100 }, { x: 80, y: 100 }, { x: 60, y: 100 }];
        direction = "Right";
        food = { x: 200, y: 200 };
        score = 0;
        level = 1;
        speed = 150;
        scoreDisplay.textContent = score;
        levelDisplay.textContent = level;
        isGameRunning = true;
        drawSnake();
        gameInterval = setInterval(moveSnake, speed);
    }

    function gameOver() {
        alert("Koniec gry! Dzięki za grę!");
        isGameRunning = false;
        clearInterval(gameInterval);
    }

    resetButton.addEventListener("click", resetGame);
    document.addEventListener("keydown", changeDirection);

    resetGame();
});

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="main.css">
    <script src="main.js"></script>
    <script src="searching.js"></script>
    <script src="sorting.js"></script>
    <script src="maze.js"></script>
    <title>Algorithms</title>
</head>
<body>
    <div class="center header"><h1>Alogrithms</h1></div>
    <div class='center menu'>
        <button onclick="setAlgorithm('sorting')">Sorting</button>
        <button onclick="setAlgorithm('searching')">Searching</button>
        <button onclick="setAlgorithm('maze')">Maze</button>
    </div>
    <div class="center toolbox">
        <div class="center">
            <select name="methods" id="methods">
                <option value="quick">Quick</option>
                <option value="merge">Merge</option>
                <option value="insertion">Insertion</option>
                <option value="bubble">Bubble</option>
                <option value="selection">Selection</option>
            </select>
            <button style="margin-right: 5px;" onclick="run()">>>></button>
        </div>
        <div>
            <label  id='numberLabel' class='slider-label' for="number">5</label>
            <input oninput="refresh()" type="range" min="25" max="250" value="25" class="slider" id="number">
            <label style='margin-top: 10px' class='slider-label' for="number">Items</label>
        </div>
        <div>
            <label id='speedLabel' class='slider-label'  for="speed">5</label>
            <input onchange="updateSpeed()" type="range" min="1" max="100" value="50" class="slider" id="speed">
            <label style='margin-top: 10px'  class='slider-label' for="speed">Speed (%)</label>
        </div>
    </div>
    <div class="main">
        <div id="data" class="data"></div>
        <svg id="svg">
        </svg>
    </div>
</body>
</html>
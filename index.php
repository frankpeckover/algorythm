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
        <button onclick="initialiseSorting(25)">Sorting</button>
        <button onclick="initialiseSearching(5)">Searching</button>
        <button onclick="initialiseMaze(100)">Maze</button>
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
            <label  id='numberLabel' class='slider-label' for="number">Items</label>
            <input oninput="showSliderValue(itemsLabel, itemsSlider)" onchange="updateItems()" type="range" min="25" max="250" value="25" class="slider" id="number">
            <label style='margin-top: 10px' class='slider-label' for="number">Items</label>
        </div>
        <div>
            <label id='speedLabel' class='slider-label'  for="speed">50</label>
            <input oninput="showSliderValue(speedLabel, speedSlider)" onchange="updateSpeed()" type="range" min="1" max="100" value="50" class="slider" id="speed">
            <label style='margin-top: 10px' class='slider-label' for="speed">Speed (%)</label>
        </div>
    </div>
    <div class="main">
        <canvas id="canvas" class='canvas'></canvas>
        <div id="data" class="data">
            <h1 style='text-align: center; position: absolute; width: 100%; top: 40%;'>WELCOME... PLEASE SELECT A METHOD</h1>
        </div>
        <svg id="svg"></svg>
    </div>
</body>
</html>
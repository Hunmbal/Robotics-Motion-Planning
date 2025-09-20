// Game variables
let canvas, ctx;
let startPoint = null;
let goalPoint = null;
let robot = null;
let simulationRunning = false;





// Initialize the game
function initGame() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  drawMap();
  // Set up event listeners for canvas
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPoint(x, y);
  });

  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setGoalPoint(x, y);
  });

  document.getElementById('pauseBtn').addEventListener('click', togglePause);
  document.getElementById('resetBtn').addEventListener('click', resetGame);
}




// Draw the map (image or fallback)
function drawMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (typeof uploadedMapImg !== 'undefined' && uploadedMapImg) {
    ctx.drawImage(uploadedMapImg, 0, 0, canvas.width, canvas.height);
  } else {
    // fallback map
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.fillRect(200, 150, 200, 180);
  }

  if (startPoint) {
    ctx.fillStyle = '#27ae60';
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText('Start', startPoint.x - 12, startPoint.y - 15);
  }

  if (goalPoint) {
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(goalPoint.x, goalPoint.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText('Goal', goalPoint.x - 10, goalPoint.y - 15);
  }

  if (robot) drawRobot();
}




// Draw the robot and small sensor dots
function drawRobot() {
  const { x, y } = robot.currentLoc;
  const angle = (robot.direction * Math.PI) / 180;

  const size = 15;   // triangle length
  const width = 10;  // triangle base half-ish

  const tipX = x + Math.cos(angle) * size;
  const tipY = y - Math.sin(angle) * size;
  const leftX = x + Math.cos(angle + (2 * Math.PI / 3)) * width;
  const leftY = y - Math.sin(angle + (2 * Math.PI / 3)) * width;
  const rightX = x + Math.cos(angle - (2 * Math.PI / 3)) * width;
  const rightY = y - Math.sin(angle - (2 * Math.PI / 3)) * width;

  ctx.fillStyle = "#3498db";
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(leftX, leftY);
  ctx.lineTo(rightX, rightY);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#2980b9";
  ctx.lineWidth = 2;
  ctx.stroke();

  // small sensor dots (3x3)
//   ctx.fillStyle = "red";
//   const drawDot = (px, py) => ctx.fillRect(Math.round(px) - 1, Math.round(py) - 1, 3, 3);
//   drawDot(robot.front.x, robot.front.y);
//   drawDot(robot.back.x, robot.back.y);
//   drawDot(robot.left.x, robot.left.y);
//   drawDot(robot.right.x, robot.right.y);
}




// Set the start point
function setStartPoint(x, y) {
  startPoint = { x, y };
  document.getElementById('currentPos').textContent = `(${Math.round(x)}, ${Math.round(y)})`;

  if (!robot) {
    robot = new Robot(x, y);
  } else {
    robot.currentLoc = { x, y };
    robot.updateSensors();
  }

  if (goalPoint) robot.setTarget(goalPoint.x, goalPoint.y);
  drawMap();
}




// Set the goal point
function setGoalPoint(x, y) {
  goalPoint = { x, y };
  document.getElementById('goalPos').textContent = `(${Math.round(x)}, ${Math.round(y)})`;

  if (robot) robot.setTarget(x, y);
  drawMap();
}




// Update distance to goal
function updateDistance() {
  if (robot && robot.targetLoc) {
    const dx = robot.targetLoc.x - robot.currentLoc.x;
    const dy = robot.targetLoc.y - robot.currentLoc.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    document.getElementById('distance').textContent = Math.round(distance);
  }
}




function drawGame() { drawMap(); }

// Toggle pause
function togglePause() {
  if (!robot || !robot.targetLoc) return;
  simulationRunning = !simulationRunning;
  document.getElementById('pauseBtn').textContent = simulationRunning ? 'Pause' : 'Play';
  document.getElementById('status').textContent = simulationRunning ? 'Running' : 'Paused';
  if (simulationRunning) runSimulation();
}



// Reset the game
function resetGame() {
  startPoint = null;
  goalPoint = null;
  robot = null;
  simulationRunning = false;

  document.getElementById('currentPos').textContent = 'Not set';
  document.getElementById('goalPos').textContent = 'Not set';
  document.getElementById('distance').textContent = '-';
  document.getElementById('steps').textContent = '0';
  document.getElementById('status').textContent = 'Ready';
  document.getElementById('pauseBtn').textContent = 'Pause';
  drawMap();
}



// Simluation handler
function runSimulation() {
  if (!simulationRunning || !robot || !robot.targetLoc) return;
  if (typeof customSimulate === 'function') customSimulate(robot);
  const dx = robot.targetLoc.x - robot.currentLoc.x;
  const dy = robot.targetLoc.y - robot.currentLoc.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < 10) {
    robot.stop();
    document.getElementById('status').textContent = "Goal Reached!";
    document.getElementById('status').style.color = "#27ae60";
  }
  if (simulationRunning) setTimeout(runSimulation, 50);
}

// Initialize on load
window.onload = initGame;

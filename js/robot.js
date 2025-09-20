// Robot class definition
class Robot {
    currentLoc;
    targetLoc;
    direction;
    #steps;
    #front;
    #back;
    #left;
    #right;

  constructor(x, y) {
    this.currentLoc = { x, y };
    this.targetLoc = null;
    this.direction = 0; // degrees: 0 = right, 90 = up
    this.steps = 0;

    this.front = { x: 0, y: 0 };
    this.back  = { x: 0, y: 0 };
    this.left  = { x: 0, y: 0 };
    this.right = { x: 0, y: 0 };

    this.updateSensors();
  }

  setTarget(x, y) {
    this.targetLoc = { x, y };
    document.getElementById('goalPos').textContent = `(${x}, ${y})`;
    updateDistance();
  }

  // keep sensors current before checking
  updateSensors(distance = 17) {
    const rad = this.direction * Math.PI / 180;
    this.front.x  = this.currentLoc.x + Math.cos(rad) * distance;
    this.front.y  = this.currentLoc.y - Math.sin(rad) * distance;

    this.back.x   = this.currentLoc.x - Math.cos(rad) * distance;
    this.back.y   = this.currentLoc.y + Math.sin(rad) * distance;

    this.left.x   = this.currentLoc.x + Math.cos(rad - Math.PI / 2) * distance * 1.2;
    this.left.y   = this.currentLoc.y - Math.sin(rad - Math.PI / 2) * distance * 1.2;

    this.right.x  = this.currentLoc.x + Math.cos(rad + Math.PI / 2) * distance * 1.2;
    this.right.y  = this.currentLoc.y - Math.sin(rad + Math.PI / 2) * distance * 1.2;
  }

  isFrontFree() { this.updateSensors(); return this.#checkCollision(this.front.x, this.front.y); }
  isBackFree()  { this.updateSensors(); return this.#checkCollision(this.back.x, this.back.y); }
  isLeftFree()  { this.updateSensors(); return this.#checkCollision(this.left.x, this.left.y); }
  isRightFree() { this.updateSensors(); return this.#checkCollision(this.right.x, this.right.y); }

    // private helper: returns true when FREE, false when BLOCKED
    #checkCollision(x, y, threshold = 100) {
        if (!ctx) return false;
    
        const px = Math.floor(x), py = Math.floor(y);
    
        // Out of bounds → blocked
        if (px < 0 || px >= canvas.width || py < 0 || py >= canvas.height) return false;
    
        try {
        const pixel = ctx.getImageData(px, py, 1, 1).data;
        const brightness = (pixel[0] + pixel[1] + pixel[2]) / 3;
        return brightness >= threshold; // true = free, false = blocked
        } catch (err) {
        console.error('Collision check error:', err);
        return false; // treat as blocked
        }
    }
  

  moveStraight() {
    if (!this.isFrontFree()) return false;


    const rad = this.direction * Math.PI / 180;
    this.currentLoc.x += Math.cos(rad) * 5;
    this.currentLoc.y -= Math.sin(rad) * 5;

    if (!this.isRightFree()) {
        this.turnAngle(-4);
    } 
    if (!this.isLeftFree()) {
        this.turnAngle(4);
    }

    this.steps++;
    document.getElementById('steps').textContent = this.steps;
    this.updateSensors();
    updateDistance();
    drawGame();
    return true;
  }

  turnAngle(angle) {
    this.direction = (this.direction + angle) % 360;
    if (this.direction < 0) this.direction += 360;
    this.steps++;
    document.getElementById('steps').textContent = this.steps;
    this.updateSensors();
    drawGame();
  }

  stop() {
    simulationRunning = false;
    document.getElementById('status').textContent = "Stopped";
  }

  log(msg) {
    console.log(`Robot: ${msg}`);
  }




}
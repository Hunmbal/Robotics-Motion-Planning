# Robot Simulation API

This project provides a simple robot simulation environment.  
Users can control a robot by writing JavaScript code inside the simulation loop.
Demo: https://www.youtube.com/watch?v=rZEMin_2KCM
---

## Main Loop

```js
simulate(robot)
````

* Entry point of the simulation.
* Write your control logic here to move the robot and interact with the environment.

---

## Robot Class

### Movement Functions

```js
robot.moveStraight()
```

* Moves the robot one step forward in its current direction.

```js
robot.turnAngle(angle)
```

* Rotates the robot by the given angle (relative angle in degrees).
* `90` → turn left
* `-90` → turn right

---

### Collision Detection

```js
robot.isFrontFree()  // bool
robot.isBackFree()   // bool
robot.isLeftFree()   // bool
robot.isRightFree()  // bool
```

* Return `true` if the respective direction is free of obstacles.

---

### Robot Variables

```js
robot.currentLoc = { x, y }   // Current coordinates
robot.targetLoc = { x, y }    // Goal point (null if unset)
robot.direction = 0           // Current global angle (0 = right, 90 = up, etc.)
```

---

## Example

```js
simulate(robot) {
    if (robot.isFrontFree()) {
        robot.moveStraight();
    } else {
        robot.turnAngle(90);
    }
}
```

---

## Notes

* `direction` uses standard angles:
  * `0° = right`, `90° = up`, `180° = left`, `270° = down`.
* Customize logic inside `simulate(robot)` to implement different algorithms.
* You can upload your js script and maps
* Map must be 720x480 black and white
* Left and right click on the map to insert target and starting point respectively 

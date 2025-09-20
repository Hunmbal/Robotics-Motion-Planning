function simulate(robot) {
  // Vector towards goal
  const dx = robot.targetLoc.x - robot.currentLoc.x;
  const dy = robot.targetLoc.y - robot.currentLoc.y;
  const targetAngle = Math.atan2(-dy, dx) * 180 / Math.PI;

  // Angle difference
  let angleDiff = targetAngle - robot.direction;
  if (angleDiff > 180) angleDiff -= 360;
  if (angleDiff < -180) angleDiff += 360;


  robot.moveStraight();
  // Move toward goal if free
  if (robot.isFrontFree()) {


    if (angleDiff < 0) {

          if (robot.isRightFree) {
              if (Math.abs(angleDiff) < 10) {robot.turnAngle(angleDiff);} 
              else { robot.turnAngle(-10); }
          }
    } else if (angleDiff > 0) {

          if (robot.isLeftFree) {
              if (Math.abs(angleDiff) < 10) {robot.turnAngle(angleDiff); } 
              else { robot.turnAngle(10); }
          }

    }

  } else {


        robot.turnAngle(45);


      

  }
}

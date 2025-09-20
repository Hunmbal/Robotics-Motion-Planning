// Screen navigation
document.getElementById('playBtn').addEventListener('click', () => {
    document.getElementById('homeScreen').classList.remove('active');
    document.getElementById('playScreen').classList.add('active');
});

document.getElementById('backBtn').addEventListener('click', () => {
    document.getElementById('playScreen').classList.remove('active');
    document.getElementById('homeScreen').classList.add('active');
});

document.getElementById('startGameBtn').addEventListener('click', () => {
    document.getElementById('playScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');
    initGame();
});

document.getElementById('backToPlayBtn').addEventListener('click', () => {
    document.getElementById('gameScreen').classList.remove('active');
    document.getElementById('playScreen').classList.add('active');
});


let uploadedMapImg = null;
document.getElementById("mapUpload").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    uploadedMapImg = new Image();
    uploadedMapImg.src = url;
    uploadedMapImg.onload = () => {
      drawMap(); // redraw once the image is loaded
    };
  }
});


let customSimulate = null;
// When uploading a script
document.getElementById("scriptUpload").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      // Evaluate the uploaded script
      try {
        eval(event.target.result); 
        if (typeof simulate === "function") {
          customSimulate = simulate; // store reference
          console.log("Simulation script loaded:", file.name);
        } else {
          alert("No 'simulate(robot)' function found in script.");
        }
      } catch (err) {
        console.error("Script error:", err);
      }
    };
    reader.readAsText(file);
  }
});

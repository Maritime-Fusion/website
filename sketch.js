/**
 * sketch.js
 * Basic p5 shooting star example with a continuous, thinning tail.
 */

let animating = false;    // Are we currently animating?
let t = 0;                // A parameter from 0..1 to control the animation
let tailPositions = [];   // Store previous star positions for the tail

function setup() {
  // Create the full-screen canvas
  createCanvas(windowWidth, windowHeight);

  // Remove stroke so shapes are smooth
  noStroke();
}

function draw() {
  // Clear the entire canvas each frame (transparent background)
  clear();

  if (animating) {
    // Increase parameter (controls how far along the path we are)
    t += 0.02;

    // Calculate star's position (circular path around screen center)
    let angle = TWO_PI * t;
    let radius = 90 * t;  // Moves outward as 't' increases
    let x = width / 2 + radius * cos(angle);
    let y = height / 2 + radius * sin(angle);

    // Store the new position
    tailPositions.push({ x, y });

    // Limit the tail length to keep the array manageable
    // (e.g. only keep the last 60 positions)
    if (tailPositions.length > 60) {
      tailPositions.shift();
    }

    // Draw the main star (head)
    // Pinkish-purple; larger circle so it's clearly the head
    fill(255, 51, 255, 230);
    // ellipse(x, y, 40, 40);

    // Draw the tail from newest to oldest (reverse)
    // so the head is the first we encounter (biggest & brightest)
    for (let i = tailPositions.length - 1; i >= 0; i--) {
      // 'age' = how many frames back from the newest
      let age = (tailPositions.length - 1) - i;
      // factor goes from 0 (newest) to 1 (oldest)
      let factor = age / (tailPositions.length - 1);

      // Fade out and shrink over time:
      // - newest (factor ~ 0) => alpha ~ 255, size ~ 20
      // - oldest (factor ~ 1) => alpha ~ 0,   size ~ 3
      let alphaVal = lerp(255, 0, factor);
      let sizeVal = lerp(20, 3, factor);

      // Tail color: lighter pinkish purple
      fill(255, 153, 255, alphaVal);
      ellipse(tailPositions[i].x, tailPositions[i].y, sizeVal, sizeVal);
    }

    // End the animation once t has passed a certain threshold
    if (t > 5) {
      animating = false;
      t = 0;
      tailPositions = [];
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/**
 * Called from the HTML button:
 * <button class="click-me" onclick="startShootingStar()">Click Me</button>
 */
function startShootingStar() {
  if (!animating) {
    animating = true;
  }
}

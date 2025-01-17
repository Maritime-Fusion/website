/**
 * sketch.js
 * "Shooting star" with elliptical motion, Perlin noise jitter, 
 * and color shifting in pink/purple/blue range.
 */

let animating = false;    // Are we currently animating?
let t = 0;                // A parameter from 0..1 to control the base animation
let tailPositions = [];   // Store previous star positions for the tail
let noiseAmount = 1;      // Single parameter to control noise intensity
let ellipseRotation = 0;  // Rotation/skew for the ellipses

function setup() {
  resizeCanvasTo75Percent();
  // Switch to HSB color mode so we can smoothly cycle hue
  colorMode(HSB, 360, 100, 100, 255);
  noStroke();
}

function draw() {
  clear();

  if (animating) {
    // Increment parameter t
    t += 0.02;

    // Base angle for elliptical orbit
    let baseAngle = TWO_PI * t * 1.2; 

    // Add random rotation/skew for the ellipses over time
    ellipseRotation = map(noise(t * 0.2), 0, 1, -PI / 6, PI / 6);

    // Slight random offset in angle from Perlin noise, scaled by noiseAmount
    let angleOffset = map(noise(t * 0.5), 0, 1, -0.1, 0.1) * noiseAmount;
    // Final angle
    let angle = baseAngle + angleOffset;

    // Add noise-based jitter to the ellipse radii, scaled by noiseAmount
    let majorAxisNoise = map(noise(1000 + t * 0.5), 0, 1, -6, 6) * noiseAmount;
    let minorAxisNoise = map(noise(2000 + t * 0.5), 0, 1, -3, 3) * noiseAmount;

    // Spiral outward over time, plus jitter
    let majorAxis = 0.2 * width + 20 * t + majorAxisNoise;
    let minorAxis =  0.1 * height + 10 * t + minorAxisNoise;

    // Ellipse center
    let cx = width / 2;
    let cy = height / 2;

    // Compute the star's position
    let x = cx + majorAxis * cos(angle);
    let y = cy + minorAxis * sin(angle);

    // We'll use scaleVal to simulate a simple 3D perspective
    // (the star gets bigger/smaller as it swings around)
    let scaleVal = map(sin(angle), -1, 1, 0.5, 1.5);

    // We'll also shift color based on angle. 
    // For example, let's cycle hue from 200..320 (roughly blue..pink/purple).
    let hueVal = map(sin(angle), -1, 1, 200, 320);

    // Store the new position & scaleVal & hueVal
    tailPositions.push({ x, y, scaleVal, hueVal });

    // Limit tail length
    if (tailPositions.length > 60) {
      tailPositions.shift();
    }

    // Draw tail from newest to oldest
    for (let i = tailPositions.length - 1; i >= 0; i--) {
      let age = (tailPositions.length - 1) - i;
      let factor = age / (tailPositions.length - 1); // 0..1

      // Fade out & shrink
      let alphaVal = lerp(255, 0, factor);
      let sizeVal = lerp(20, 3, factor);

      // Multiply by that star's scaleVal
      let finalSize = sizeVal * tailPositions[i].scaleVal;

      // We'll also slightly shift the hue based on factor, if you like:
      // e.g. older tail bits get a slightly different hue
      let tailHue = tailPositions[i].hueVal + factor * 20; 
      // Then wrap around if needed (HSB wraps hue at 360)
      if (tailHue > 360) tailHue -= 360;

      fill(tailHue, 100, 100, alphaVal);

      // Apply rotation to tail ellipses
      push();
      translate(tailPositions[i].x, tailPositions[i].y);
      rotate(ellipseRotation);
      ellipse(0, 0, finalSize, finalSize * 0.6);
      pop();
    }

    // Draw the main star (head) last 
    // We'll use the current hueVal and a constant alpha
    fill(hueVal, 100, 100, 230);
    let headSize = 30 * scaleVal;

    push();
    translate(x, y);
    rotate(ellipseRotation);
    ellipse(0, 0, headSize, headSize * 0.6);
    pop();

    // Stop animating after a while
    if (t > 5) {
      animating = false;
      t = 0;
      tailPositions = [];
    }
  }
}

function windowResized() {
  resizeCanvasTo75Percent();
}

function resizeCanvasTo75Percent() {
  resizeCanvas(windowWidth * 0.75, windowHeight * 0.75);
}

/**
 * Triggered by an HTML button, e.g.:
 * <button onclick="startShootingStar()">Start Shooting Star</button>
 */
function startShootingStar() {
  if (!animating) {
    animating = true;
  }
}

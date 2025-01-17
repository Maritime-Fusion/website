/**
 * sketch.js
 * "Shooting star" with:
 *   - Elliptical + Perlin noise spiral
 *   - Slower hue changes
 *   - Continuous line-based tail
 *   - Random short-lived tilt flips (left-up or right-up) from a flat orientation
 */

let animating = false;
let t = 0;
let tailPositions = [];
let noiseAmount = 1;

// We'll store how many frames remain in a "tilted" state.
// After that many frames, we set tilt back to 0 (flat).
let tiltCountdown = 0;
let globalTilt = 0;

function setup() {
  resizeCanvasTo75Percent();
  colorMode(HSB, 360, 100, 100, 255);
  noFill();
}

function draw() {
  clear();

  if (animating) {
    // Spiral speed remains the same
    t += 0.02;

    // Hue changes more slowly, so color doesn't shift too fast
    let colorT = t * 0.3;
    let hueVal = map(sin(colorT), -1, 1, 200, 320);

    // Base angle for the elliptical orbit (~2 revs total)
    let baseAngle = TWO_PI * t * 2.0;

    // Perlin noise offset => local swirl
    let angleOffset = map(noise(t * 0.7), 0, 1, -0.6, 0.6) * noiseAmount;
    let angle = baseAngle + angleOffset;

    // Jitter in ellipse radii from noise
    let majorAxisNoise = map(noise(1000 + t * 0.7), 0, 1, -15, 15) * noiseAmount;
    let minorAxisNoise = map(noise(2000 + t * 0.7), 0, 1, -10, 10) * noiseAmount;

    // Spiral outward
    let majorAxis = 0.2 * width + 20 * t + majorAxisNoise;
    let minorAxis = 0.1 * height + 10 * t + minorAxisNoise;

    // -------------------------------------------------------
    // RANDOM SHORT-LIVED TILT
    // -------------------------------------------------------
    // 1) Every ~15 frames, decide if we want to "flip" the tilt
    //    for a short period (e.g., ~15-20 frames).
    if (frameCount % 15 === 0 && tiltCountdown <= 0) {
      // 20% chance to do a tilt flip
      if (random() < 0.2) {
        // We'll flip to a random left or right angle, say ±0.3 rad
        globalTilt = random(-0.3, 0.3);
        // We'll remain tilted for e.g. 15 frames
        tiltCountdown = 15;
      }
    }

    // 2) If we're currently tilted, count down each frame
    if (tiltCountdown > 0) {
      tiltCountdown--;
      // If we reached 0, revert to flat
      if (tiltCountdown === 0) {
        globalTilt = 0;
      }
    }

    // Compute the unrotated elliptical coordinates
    let localX = majorAxis * cos(angle);
    let localY = minorAxis * sin(angle);

    // Rotate (localX, localY) by globalTilt (which may be 0 if flat)
    let rotatedX = localX * cos(globalTilt) - localY * sin(globalTilt);
    let rotatedY = localX * sin(globalTilt) + localY * cos(globalTilt);

    // Shift to center
    let cx = width / 2;
    let cy = height / 2;
    let x = cx + rotatedX;
    let y = cy + rotatedY;

    // "3D perspective" scale
    let scaleVal = map(sin(angle), -1, 1, 0.5, 1.5);

    // Push the new position
    tailPositions.push({ x, y, scaleVal, hueVal });

    // Limit tail length
    if (tailPositions.length > 60) {
      tailPositions.shift();
    }

    // === Draw the tail as a continuous curve ===
    beginShape();
    noFill();
    for (let i = 0; i < tailPositions.length; i++) {
      // age = 1 (oldest) .. 0 (newest)
      let age = 1 - i / (tailPositions.length - 1);

      let alphaVal = lerp(255, 0, age);
      // Slight hue shift with age
      let tailHue = tailPositions[i].hueVal + age * 15;
      if (tailHue > 360) tailHue -= 360;

      strokeWeight(lerp(8, 1, age));
      stroke(tailHue, 100, 100, alphaVal);

      curveVertex(tailPositions[i].x, tailPositions[i].y);
    }
    endShape();

    // === Draw the "head" (star) last ===
    fill(hueVal, 100, 100, 220);
    noStroke();
    let headSize = 30 * scaleVal;

    push();
    translate(x, y);
    ellipse(0, 0, headSize, headSize * 0.6);
    pop();

    // Stop after some time
    if (t > 10) {
      animating = false;
      t = 0;
      tailPositions = [];
      globalTilt = 0;
      tiltCountdown = 0;
    }
  }
}

function windowResized() {
  resizeCanvasTo75Percent();
}

function resizeCanvasTo75Percent() {
  resizeCanvas(windowWidth * 0.75, windowHeight * 0.75);
}

function startShootingStar() {
  if (!animating) {
    animating = true;
  }
}

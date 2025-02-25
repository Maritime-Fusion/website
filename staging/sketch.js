/**
 * sketch.js
 * "Shooting star" with:
 *   - Elliptical + Perlin noise spiral
 *   - Slower hue changes
 *   - Continuous line-based tail
 *   - Random short-lived tilt flips (left-up or right-up)
 *   - Force an elliptical shape regardless of screen aspect ratio
 */

let animating = false;
let t = 0;
let tailPositions = [];
let noiseAmount = 1;

// We'll store how many frames remain in a "tilted" state.
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
    // 1) Time parameter for spiral speed
    t += 0.02;

    // 2) Hue changes more slowly so it doesn't shift too quickly
    let colorT = t * 0.3;
    let hueVal = map(sin(colorT), -1, 1, 200, 320);

    // 3) Base angle for elliptical orbit (~2 revs total)
    let baseAngle = TWO_PI * t * 2.0;

    // 4) Perlin noise offset => local swirl
    let angleOffset = map(noise(t * 0.7), 0, 1, -0.6, 0.6) * noiseAmount;
    let angle = baseAngle + angleOffset;

    // 5) Force a consistent ellipse shape using min(width, height),
    //    so on tall phone screens the ellipse doesn't look like a circle.
    const baseSize = min(width, height)/2; 
    //    E.g. majorAxis ~ 0.4 * baseSize, minorAxis ~ 0.2 * baseSize
    let majorAxisNoise = map(noise(1000 + t * 0.7), 0, 1, -15, 15) * noiseAmount;
    let minorAxisNoise = map(noise(2000 + t * 0.7), 0, 1, -10, 10) * noiseAmount;
    
    let majorAxis = 0.5 * baseSize + 20 * t + majorAxisNoise;
    let minorAxis = 0.1 * baseSize + 10 * t + minorAxisNoise;

    // --- RANDOM SHORT-LIVED TILT (flat default, occasional flip) ---
    if (frameCount % 15 === 0 && tiltCountdown <= 0) {
      // e.g. 20% chance to do a tilt flip
      if (random() < 0.3) {
        globalTilt = random(-0.3, 0.3); // random small tilt
        tiltCountdown = 20;             // remain tilted for 15 frames
      }
    }
    if (tiltCountdown > 0) {
      tiltCountdown--;
      if (tiltCountdown === 0) {
        globalTilt = 0; // revert to flat
      }
    }

    // Compute unrotated elliptical coords
    let localX = majorAxis * cos(angle);
    let localY = minorAxis * sin(angle);

    // Rotate (localX, localY) by the global tilt
    let rotatedX = localX * cos(globalTilt) - localY * sin(globalTilt);
    let rotatedY = localX * sin(globalTilt) + localY * cos(globalTilt);

    // Screen center
    let cx = width / 2;
    let cy = height / 2;
    let x = cx + rotatedX;
    let y = cy + rotatedY;

    // Fake 3D perspective: scaleVal
    let scaleVal = map(sin(angle), -1, 1, 0.5, 1.5);

    // Save the position
    tailPositions.push({ x, y, scaleVal, hueVal });
    if (tailPositions.length > 60) {
      tailPositions.shift();
    }

    // === Draw tail as a continuous curve ===
    beginShape();
    noFill();
    for (let i = 0; i < tailPositions.length; i++) {
      let age = 1 - i / (tailPositions.length - 1);
      let alphaVal = lerp(255, 0, age);
      let tailHue = tailPositions[i].hueVal + age * 15;
      if (tailHue > 360) tailHue -= 360;

      strokeWeight(lerp(4, 1, age));
      stroke(tailHue, 100, 100, alphaVal);

      curveVertex(tailPositions[i].x, tailPositions[i].y);
    }
    endShape();

    // === Draw the "head" last ===
    fill(hueVal, 100, 100, 220);
    noStroke();
    let headSize = 30 * scaleVal;

    push();
    translate(x, y);
    ellipse(0, 0, headSize, headSize * 0.6);
    pop();

    // End animation after 10 sec
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

// Example: keeps width at 75% of the screen width, height at 50% of screen height
// or use your own logic
function resizeCanvasTo75Percent() {
  resizeCanvas(windowWidth * 0.75, windowHeight * 0.75);
}

function startShootingStar() {
  if (!animating) {
    animating = true;
  }
}

// Setup both background video and content video
function setupVideos() {
  // Setup content area video with lazy loading
  setupVideoLazyLoading();
  
  // Setup background video
  const backgroundVideo = document.getElementById('background-video');
  if (backgroundVideo) {
    // Create and append source elements
    const mp4Source = document.createElement('source');
    mp4Source.setAttribute('src', 'video_optimized.mp4');
    mp4Source.setAttribute('type', 'video/mp4');
    
    const webmSource = document.createElement('source');
    webmSource.setAttribute('src', 'video.webm');
    webmSource.setAttribute('type', 'video/webm');
    
    // Append sources to video element
    backgroundVideo.appendChild(mp4Source);
    backgroundVideo.appendChild(webmSource);
    
    // Load and play the video
    backgroundVideo.load();
    
    // Start playing when ready
    backgroundVideo.addEventListener('canplaythrough', function() {
      backgroundVideo.play().catch(error => {
        console.log('Autoplay prevented:', error);
      });
    });
  }
}

// Video lazy loading function
function setupVideoLazyLoading() {
  const videoContainers = document.querySelectorAll('.video-container');
  
  videoContainers.forEach(container => {
    const placeholder = container.querySelector('.video-placeholder');
    const video = container.querySelector('video');
    
    if (placeholder && video) {
      placeholder.addEventListener('click', function() {
        // Set the video source only when clicked
        const sources = video.querySelectorAll('source');
        sources.forEach(source => {
          const dataSrc = source.getAttribute('data-src');
          if (dataSrc) {
            source.setAttribute('src', dataSrc);
          }
        });
        
        // Load and play the video
        video.load();
        video.play();
        
        // Hide the placeholder
        placeholder.style.display = 'none';
      });
    }
  });
}

// Call the functions when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  setupVideos();
  
  // Trigger shooting star occasionally
  setInterval(function() {
    if (Math.random() < 0.3 && !animating) {
      startShootingStar();
    }
  }, 8000);
});

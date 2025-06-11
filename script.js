var frameNumber = 0, // start video at frame 0
  // lower numbers = faster playback
  playbackConst = 200,
  // get page height from video duration
  setHeight = document.getElementById("set-height"),
  // select video element         
  vid = document.getElementById('scrollVideo');

// For smooth transitions
let currentFrameNumber = 0;
let targetFrameNumber = 0;
let lastTime = 0;
const lerpAmount = 0.1; // Adjust between 0.05-0.2 for different smoothness levels

// dynamically set the page height according to video length
vid.addEventListener('loadedmetadata', function () {
  setHeight.style.height = Math.floor(vid.duration) * playbackConst + "px";
  currentFrameNumber = vid.currentTime;
});

// Use requestAnimationFrame for smooth playback
function scrollPlay(timestamp) {
  // Calculate delta time to ensure consistent smoothing regardless of frame rate
  const deltaTime = timestamp - lastTime || 0;
  lastTime = timestamp;
  
  // Calculate target frame based on scroll position
  targetFrameNumber = window.pageYOffset / playbackConst;
  
  // Linear interpolation for smoother motion
  // The higher the deltaTime, the more we need to catch up
  const lerpFactor = Math.min(1.0, lerpAmount * (deltaTime / 16.67));
  currentFrameNumber = currentFrameNumber + (targetFrameNumber - currentFrameNumber) * lerpFactor;
  
  // Apply the new time if it's changed enough (avoid micro-updates)
  if (Math.abs(vid.currentTime - currentFrameNumber) > 0.01) {
    vid.currentTime = currentFrameNumber;
  }
  
  // Optimize by using passive: true for scroll events
  window.requestAnimationFrame(scrollPlay);
}

// Add will-change to improve browser rendering performance
vid.style.willChange = 'transform';

// Start the animation loop
window.requestAnimationFrame(scrollPlay);

// Use passive scroll listener to prevent blocking the main thread
window.addEventListener('scroll', () => {}, { passive: true });

var curr = 1;

function scrollToView(operation) {
  curr += operation;
  curr = curr % 6;

  // Scroll to the element with the given ID
  const element = document.getElementById(curr);
  if (element) {
    const windowHeight = window.innerHeight;
    const elementRect = element.getBoundingClientRect();
    const elementHeight = elementRect.height;
    const offset = element.offsetTop - (windowHeight/2 - elementHeight/2);
    
    window.scrollTo({
      top: offset,
      behavior: 'smooth'
    });
  }
}
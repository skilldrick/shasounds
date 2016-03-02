import {ctx} from './audio.js';

// iOS won't start the audio context until a user-initiated action
const iOSAudioContextHack = (func) => {
  // Try running the func
  func();

  // If state is suspended, we're probably on iOS
  if (ctx.state === 'suspended') {
    // Show instructions
    const div = document.getElementById('ios-hack');
    div.innerHTML = 'Tap screen to play';

    // Run func on touchend
    document.addEventListener('touchend', func, false);
  }
}

module.exports = {iOSAudioContextHack};

import {ctx} from './audio.js';

const runAfterAction = (func) => {
  // Show instructions
  const div = document.getElementById('ios-hack');
  div.innerHTML = 'Tap screen to play';

  // One-time handler function
  const handler = () => {
    func();
    document.removeEventListener('touchend', handler, false);
  };

  // Run func on touchend
  document.addEventListener('touchend', handler, false);
};

// iOS won't start the audio context until a user-initiated action
const iOSAudioContextHack = (func) => {
  // If state is suspended, we're probably on iOS
  if (ctx.state === 'suspended') {
    runAfterAction(func);
  } else {
    func();
  }
};

module.exports = {iOSAudioContextHack};

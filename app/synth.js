import {ctx} from './audio.js';

const bus = ctx.createGain();
const filter = ctx.createBiquadFilter();
filter.frequency.value = 6000;
filter.connect(ctx.destination);
bus.connect(filter);

const noteToFreq = (note) => 110 * Math.pow(2, note / 12);

const playNote = (note, when, length, type) => {
  const gain = ctx.createGain();
  gain.gain.value = 0;
  gain.connect(bus);

  const osc = createOsc(noteToFreq(note), type);
  osc.connect(gain);

  const targetGain = 0.2;
  const fadeTime = 0.03;

  gain.gain.setValueAtTime(0, when);
  gain.gain.linearRampToValueAtTime(targetGain, when + fadeTime);
  gain.gain.setValueAtTime(targetGain, when + length);
  gain.gain.linearRampToValueAtTime(0, when + length + fadeTime);

  osc.start(when);
  osc.stop(when + length + fadeTime);
};

const createOsc = (frequency, type) => {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = frequency;
  return osc;
};


module.exports = {playNote};

import {ctx} from './audio.js';
import {addDelay, addDistortion} from './fx.js';

const bus1 = ctx.createGain();
const bus2 = ctx.createGain();
const filter = ctx.createBiquadFilter();
filter.connect(ctx.destination);
filter.frequency.value = 5000;

addDelay({
  source: bus1,
  destination: bus2,
  delayTime: 0.666,
  feedback: 0.2,
  dryMix: 1,
  wetMix: 0.4,
  cutoff: 2000
});

addDistortion([bus2], filter, 1.0);

const noteToFreq = (note) => 110 * Math.pow(2, note / 12);

const playNote = (note, when, length) => {
  const gain = ctx.createGain();
  gain.gain.value = 0;
  gain.connect(bus1);

  const osc = createOsc(noteToFreq(note), gain);

  const targetGain = 0.2;
  const fadeTime = 0.03;

  gain.gain.setValueAtTime(0, when);
  gain.gain.linearRampToValueAtTime(targetGain, when + fadeTime);
  gain.gain.setValueAtTime(targetGain, when + length);
  gain.gain.linearRampToValueAtTime(0, when + length + fadeTime);

  osc.start(when);
  osc.stop(when + length + fadeTime);
};

const createOsc = (frequency, output) => {

  const osc = ctx.createOscillator();
  osc.frequency.value = frequency;

  const real = new Float32Array(6);
  const imag = new Float32Array(6);

  real[0] = 0;
  imag[0] = 0;
  real[1] = 0.6;
  imag[1] = 0;
  real[2] = 0.5;
  imag[2] = 0;
  real[3] = 0.5;
  imag[3] = 0;
  real[4] = 0.2;
  imag[4] = 0;
  real[5] = 0.2;
  imag[5] = 0;
  real[6] = 0.1;
  imag[6] = 0;

  const wave = ctx.createPeriodicWave(real, imag);
  osc.setPeriodicWave(wave);
  osc.connect(output);

  return osc;
};

module.exports = {playNote};

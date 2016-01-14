import {ctx} from './audio.js';
import {createDelayNode, createDistortionNode} from './fx.js';
import {getAudioBuffer} from './ajax.js';
import {connect} from './util.js';

const bus1 = ctx.createGain();
const bus2 = ctx.createGain();
const filter = ctx.createBiquadFilter();
const convolver = ctx.createConvolver();
filter.frequency.value = 5000;

const delay = createDelayNode({
  delayTime: 0.666,
  feedback: 0.5,
  dryMix: 1,
  wetMix: 1,
  cutoff: 2000
});

const distortion = createDistortionNode(1.2);

connect(
  bus1,
  bus2,
  filter,
  delay,
  distortion,
  //convolver,
  ctx.destination
);

const noteToFreq = (note) => 110 * Math.pow(2, note / 12);

const playNote = (note, when, length) => {
  const gain = ctx.createGain();
  gain.gain.value = 0;

  const osc = createOsc(noteToFreq(note));
  connect(osc, gain, bus1);

  const targetGain = 0.2;
  const fadeTime = 0.03;

  gain.gain.setValueAtTime(0, when);
  gain.gain.linearRampToValueAtTime(targetGain, when + fadeTime);
  gain.gain.setValueAtTime(targetGain, when + length);
  gain.gain.linearRampToValueAtTime(0, when + length + fadeTime);

  osc.start(when);
  osc.stop(when + length + fadeTime);
};

const createOsc = (frequency) => {

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

  return osc;
};

module.exports = {playNote};

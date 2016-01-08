import {ctx} from './audio.js';

const sha = '4739f5c1ddb71e212f1af2df667ef20ee2cc3ec5';
const parts = sha.split('').map((num) => parseInt(num, 16));

const tune = parts.slice(0, 6);

const C = 0;
const C$ = 1;
const Db = 1;
const D = 2;
const D$ = 3;
const Eb = 3;
const E = 4;
const F = 5;
const F$ = 6;
const Gb = 6;
const G = 7;
const Ab = 8;
const A = 9;
const Bb = 10;
const B = 11;
const C2 = 12;

const scales = {
  blues: [C, Eb, F, F$, G, Bb, C2],
  jazzMin: [C, D, Eb, F, G, A, B, C2],
  tritone: [C, Db, E, Gb, G, Bb, C2],
  tritoneTwoSemi: [C, Db, D, F$, G, Ab, C2],
  prometheus: [C, D, E, F$, A, Bb, C2],
  oct1: [C, C$, D$, E, F$, G, A, Bb, C2],
  oct2: [C, D, Eb, F, Gb, Ab, A, B, C2],
  wholeTone: [C, D, E, F$, Ab, Bb, C2],
  minPent: [C, Eb, F, G, Bb, C2],
  majPent: [C, D, E, G, A, C2],
  maj: [C, D, E, F, G, A, B, C2]
};

const playNote = (note, when, length) => {
  const osc = createOsc(noteToFreq(note));
  osc.start(when);
  osc.stop(when + length);
};

const createOsc = (frequency) => {
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = frequency;

  const gain = ctx.createGain();
  gain.gain.value = 0.2;
  gain.connect(ctx.destination);
  osc.connect(gain);
  return osc;
};

const playScale = (scale) => {
  scale.forEach((note, index) => playNote(note, ctx.currentTime + index / 2, 0.5));
};


const noteToFreq = (note) => 440 * Math.pow(2, note / 12);


console.log(tune);

playScale(scales.maj);

module.exports = {};

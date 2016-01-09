import {ctx} from './audio.js';

const sha = '4739f5c1ddb71e212f1af2df667ef20ee2cc3ec5';
const parts = sha.split('').map((num) => parseInt(num, 16));

const tune = parts.slice(0, 8);

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
  const [osc, gain] = createOsc(noteToFreq(note));
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
  const gain = ctx.createGain();
  gain.gain.value = 0;
  gain.connect(ctx.destination);

  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = frequency;
  osc.connect(gain);

  return [osc, gain];
};

const noteToFreq = (note) => 220 * Math.pow(2, note / 12);

/*
const playScale = (scale) => {
  scale.forEach((note, index) => playNote(note, ctx.currentTime + index / 2, 0.5));
};

playScale(scales.maj);
*/

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

for (let i = 0; i < 32; i++) {
  for (let j = 0; j < 3; j++) {
    playNote(pickRandom(scales.majPent), ctx.currentTime + i / 3, 1 / 3);
  }
}

console.log(pickRandom(scales.blues));




module.exports = {};

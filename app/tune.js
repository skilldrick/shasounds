import {ctx} from './audio.js';
import _ from 'underscore';

//const sha = '4739f5c1ddb71e212f1af2df667ef20ee2cc3ec5';
//const parts = sha.split('').map((num) => parseInt(num, 16));
//Generate random parts array
const parts = Array.from(Array(40).keys()).map((val) => Math.floor(Math.random() * 16));

const tune = parts.slice(0, 11);
const rhythmParts = parts.slice(11, 16);

const scalePart = parts[16];
const transpose1 = parts[17];
const transpose2 = parts[18];

console.log('scale part', scalePart);
console.log('transposes:', transpose1, transpose2);

// Split each part of rhythmParts in two with bit masking and shifting
const rhythm = _.flatten(rhythmParts.map((part) => [part & 3, part >> 2])).map((part) => part + 1);

console.log(rhythm, tune);

// Numbers of semitones from A
const C = 3;
const C$ = 4;
const Db = 4;
const D = 5;
const D$ = 6;
const Eb = 6;
const E = 7;
const F = 8;
const F$ = 9;
const Gb = 9;
const G = 10;
const Ab = 11;
const A = 12;
const Bb = 13;
const B = 14;
const C2 = 15;

const scales = [
  { name: 'Major pentatonic', scale: [C, D, E, G, A, C2] },
  { name: 'Prometheus', scale: [C, D, E, F$, A, Bb, C2] },
  { name: 'Blues', scale: [C, Eb, F, F$, G, Bb, C2] },
  { name: 'Tritone', scale:   [C, Db, E, Gb, G, Bb, C2] },
  { name: 'Major', scale: [C, D, E, F, G, A, B, C2] },
  { name: 'Minor pentatonic', scale: [C, Eb, F, G, Bb, C2] },
  { name: 'Two semitone tritone', scale: [C, Db, D, F$, G, Ab, C2] },
  { name: 'Whole tone', scale: [C, D, E, F$, Ab, Bb, C2] }
  /*
  [C, D, Eb, F, G, A, B, C2], // jazz minor
  [C, Db, E, F, Gb, Ab, B, C2], // persian
  [C, D, Eb, F, Gb, Ab, A, B, C2], // octatonic 2
  [C, C$, D$, E, F$, G, A, Bb, C2], // octatonic 1
  */
];

const playNote = (note, when, length, type) => {
  const [osc, gain] = createOsc(noteToFreq(note), type);
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
  const gain = ctx.createGain();
  gain.gain.value = 0;
  gain.connect(ctx.destination);

  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = frequency;
  osc.connect(gain);

  return [osc, gain];
};

const noteToFreq = (note) => 110 * Math.pow(2, note / 12);

const get = (arr, index) => arr[index % arr.length];

const getIndexAndLoops = (arr, index) => [index % arr.length, Math.floor(index / arr.length)];

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

const getTimeAndLength = (arr, index) => {
  const lengthOfNotes = sum(arr);
  const [arrIndex, numLoops] = getIndexAndLoops(arr, index);
  const length = arr[arrIndex];
  const offset = sum(arr.slice(0, arrIndex));
  return [offset + numLoops * lengthOfNotes, length];
};

const getNote = (scale, index) => {
  const [arrIndex, numLoops] = getIndexAndLoops(scale, index);
  return scale[arrIndex] + numLoops * 12;
};

const scale = get(scales, scalePart);
console.log(scale);

const maybeReverse = (shouldReverse, arr) => shouldReverse ? arr.slice().reverse() : arr;

// transpose: number of steps of the scale to transpose this note
const playNoteAtIndex = (index, speed, type, transpose = 0, reverse = false) => {
  const note = getNote(maybeReverse(reverse, scale.scale), get(tune, index + transpose));
  const [when, length] = getTimeAndLength(maybeReverse(reverse, rhythm), index);
  playNote(note, when / speed, length / speed, type);
}

for (let i = 0; i < 64; i++) {
  if (i % 2 == 0) {
    playNoteAtIndex(i / 2, 2, 'square', transpose1, true);
  }
  if (i % 4 == 0) {
    playNoteAtIndex(i / 4, 1, 'triangle');
  }
  playNoteAtIndex(i, 4, 'sawtooth', transpose2);
}




module.exports = {};

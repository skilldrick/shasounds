import {playNote} from './synth.js';
import tuneConfig from './tune_config.js';

//const sha = '4739f5c1ddb71e212f1af2df667ef20ee2cc3ec5';

const config = tuneConfig();
console.log(JSON.stringify(config));

const get = (arr, index) => arr[index % arr.length];

// index modulo array length, index // array length
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

const maybeReverse = (shouldReverse, arr) => shouldReverse ? arr.slice().reverse() : arr;

// For less randomness, slice rhythm and tune to be same length
const slicedTune = config.tune;//.slice(0, 6);
const slicedRhythm = config.rhythm;//.slice(0, 6);

// transpose: number of steps of the scale to transpose this note
const playNoteAtIndex = (index, speed, type, transpose = 0, reverse = false) => {
  const note = getNote(config.scale, get(maybeReverse(reverse, slicedTune), index + transpose));
  const [when, length] = getTimeAndLength(maybeReverse(reverse, slicedRhythm), index);
  playNote(note, when / speed, length / speed, type);
}

for (let i = 0; i < 64; i++) {
  if (i % 2 == 0) {
    playNoteAtIndex(i / 2, 2, 'square', config.transposes[0], true);
  }
  if (i % 4 == 0) {
    playNoteAtIndex(i / 4, 1, 'triangle');
  }
  playNoteAtIndex(i, 4, 'sawtooth', config.transposes[1]);
}




module.exports = {};

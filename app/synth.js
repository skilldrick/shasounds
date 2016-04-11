import {ctx} from 'sine/audio';
import {connect, node} from 'sine/util';
import {EasyHarmonicSynth} from 'sine/synth';
import {Distortion, FeedbackDelay, Reverb} from 'sine/fx';
import {createGain, createFilter} from 'sine/nodes';
import impulseResponse from '../assets/conic_echo_long_hall_short.mp3';
import getAudioBuffer from 'sine/ajax';

const synthLoaded = getAudioBuffer(impulseResponse).then(buffer => {
  console.log('loaded');
  reverb.convolver.buffer = buffer;
});

const filter = createFilter(3000);
const distortion = new Distortion(1.2);
const reverb = new Reverb(0.5);

const delay = new FeedbackDelay({
  delayTime: 0.666,
  feedback: 0.5,
  mix: 0.5,
  cutoff: 1000
});

const synth = new EasyHarmonicSynth({
  attack: 0.1,
  decay: 0.3,
  sustain: 0.6,
  release: 0.1
});

synth.setLowHigh(0);

connect(
  synth,
  delay,
  distortion,
  reverb,
  filter,
  ctx.destination
);

module.exports = {synth, synthLoaded};

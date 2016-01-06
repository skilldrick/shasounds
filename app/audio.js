import {getAudioBuffer, getAudioBuffers} from './ajax.js';

const ctx = new (window.AudioContext || window.webkitAudioContext)();

const createSource = (buffer) => {
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  return source;
};

const getBuffers = bufferMap => getAudioBuffers(ctx, bufferMap);

const getCurrentTime = () => ctx.currentTime;

module.exports = {ctx, createSource, getBuffers, getCurrentTime};

import {objToAssoc, assocToObj} from './utils.js';

const getData = (filename, cb) => {
  const request = new XMLHttpRequest();
  request.open('GET', filename, true);
  request.responseType = 'arraybuffer';
  request.onload = () => {
    cb(request.response);
  };
  request.send();
}

const getAudioBuffer = (ctx, filename) => {
  return new Promise(resolve => {
    getData(filename, (audioData) => {
      ctx.decodeAudioData(audioData, resolve);
    });
  });
};

const getAudioBuffers = (ctx, bufferMap) => {
  const bufferFutures = objToAssoc(bufferMap).map(([key, filename]) => {
    return getAudioBuffer(ctx, filename).then(buffer => [key, buffer]);
  });

  return Promise.all(bufferFutures).then(buffers => assocToObj(buffers));
}

module.exports = {getAudioBuffer, getAudioBuffers};

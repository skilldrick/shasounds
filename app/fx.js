import {ctx} from './audio.js';
import {getAudioBuffer} from './ajax.js';
import {connect} from './util.js';

const createFilterNode = (freq) =>{
  const filter = ctx.createBiquadFilter();
  filter.frequency.value = freq;
  return filter;
};

const createReverbNode = () => {
  const convolver = ctx.createConvolver();
  const impulseResponse = "Conic Long Echo Hall.wav";

  getAudioBuffer(ctx, impulseResponse).then(buffer => {
    convolver.buffer = buffer;
  });

  return convolver;
};

const createDelayNode = (options) => {
  const dryMix = options.dryMix || 1;
  const wetMix = options.wetMix || 0.5;
  const delayTime = options.delayTime || 0.5;
  const feedback = options.feedback || 0.2;
  const cutoff = options.cutoff || 5000;

  const input = ctx.createGain();
  const output = ctx.createGain();
  const delay = ctx.createDelay(3);
  const feedbackGain = ctx.createGain();
  const dryMixNode = ctx.createGain();
  const wetMixNode = ctx.createGain();
  const filter = createFilterNode(cutoff);

  delay.delayTime.value = delayTime;
  feedbackGain.gain.value = feedback;
  dryMixNode.gain.value = dryMix;
  wetMixNode.gain.value = wetMix;


  // dry chain
  connect(input, dryMixNode, output);

  // wet chain
  connect(input, filter, feedbackGain, delay, wetMixNode, output);

  // feedback
  connect(delay, filter);

  return {
    input: input,
    connect: (node) => output.connect(node)
  };

  //input +-> dryMixNode ------------------------------------*-> output
  //      `> filter -> feedbackGain -> delay -+> wetMixNode -'
  //           ^------------------------------'
};

const createDistortionNode = (distortion) => {
  const waveShaperNode = ctx.createWaveShaper();

  waveShaperNode.curve = makeDistortionCurve((item) => {
    return Math.pow(Math.sin(item * Math.PI / 2), 1 / distortion);
  });

  waveShaperNode.oversample = '4x';

  return waveShaperNode;
};

const makeDistortionCurve = (func) => {
  const length = Math.pow(2, 16);
  const halfLength = length / 2;
  let curve = [];
  for (let i = 0; i < length; i++) {
    curve[i] = i / (length / 2) - 1;
  }

  const mirror = (func) => {
    return (item, i, arr) => {
      if (i < arr.length / 2) {
        return -func(-item);
      } else {
        return func(item);
      }
    };
  };

  curve = curve.map(mirror(func));

  //keep within -1,1 range
  curve = curve.map((item) => {
    return Math.max(Math.min(item, 1), -1);
  });

  return new Float32Array(curve);
};

module.exports = {createFilterNode, createReverbNode, createDelayNode, createDistortionNode};

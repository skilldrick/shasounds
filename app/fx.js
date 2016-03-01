import {ctx} from './audio.js';
import {getAudioBuffer} from './ajax.js';
import {connect, node} from './util.js';

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

  return node(input, output);

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

/*
A distortion curve maps input to output. A straight line from
(-1, -1) to (1, 1) leaves the sound unchanged. A straight line
from (-1, 0.5) to (1, 0.5) is the equivalent of applying a gain
of 0.5 (the output level is half the input level).

                 output
                  1|         .
                   |       .
                   |     .
                   |   .
                   | .
         ----------0---------- input
        -1       . |         1
               .   |
             .     |
           .       |
         .       -1|

If the curve is not a straight line (see below), different parts of
the signal will be amplified differently from others, changing the
shape of the waveform. This produces distortion. The curve below
also increases the overall level of the signal, as quieter samples
are boosted louder.

                 output
                  1|         .
                   |     .
                   |   .
                   | .
                   |.
         ----------0---------- input
        -1        .|         1
                 . |
               .   |
             .     |
         .       -1|

A mirrored distortion curve (negative inputs are modified by the same
amount as positive inputs) is usually best, as it prevents the output
from having a DC offset. The curve above is mirrored.

The WaveShaperNode uses a Float32Array to represent the distortion
curve. The indices of the array correspond to the input range [-1, 1]
and the values in the array correspond to the output range [-1, 1].

makeDistortionCurve takes a func, applies it to the range [0, 1], and
applies the inverse of the function to the range [-1, 0] to create
a mirrored distortion curve, like above.
*/

const makeDistortionCurve = (func) => {
  const mirror = (func) => {
    return (item, i) => {
      if (i < halfLength) {
        return -func(-item);
      } else {
        return func(item);
      }
    };
  };

  //keep within -1,1 range
  const clamp = (items) => {
    return items.map((item) => Math.max(Math.min(item, 1), -1));
  }

  const length = Math.pow(2, 16);
  const halfLength = length / 2;
  const linearCurve = [];

  // create linear identity curve
  for (let i = 0; i < length; i++) {
    linearCurve[i] = i / halfLength - 1;
  }

  const curve = clamp(linearCurve.map(mirror(func)));

  return new Float32Array(curve);
};

module.exports = {createFilterNode, createReverbNode, createDelayNode, createDistortionNode};

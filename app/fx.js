import {ctx} from './audio.js';

const addDelay = (options) => {
  const dryMix = options.dryMix || 1;
  const wetMix = options.wetMix || 0.5;
  const delayTime = options.delayTime || 0.5;
  const feedback = options.feedback || 0.2;
  const cutoff = options.cutoff || 5000;
  const source = options.source;
  const destination = options.destination;

  const delay = ctx.createDelay(3);
  const feedbackGain = ctx.createGain();
  const dryMixNode = ctx.createGain();
  const wetMixNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  delay.delayTime.value = delayTime;
  feedbackGain.gain.value = feedback;
  dryMixNode.gain.value = dryMix;
  wetMixNode.gain.value = wetMix;

  filter.type = 'lowpass';
  filter.frequency.value = cutoff;
  filter.Q.value = .5;

  source.connect(dryMixNode);
  dryMixNode.connect(destination);

  source.connect(filter);
  delay.connect(filter);

  filter.connect(feedbackGain);
  feedbackGain.connect(delay);
  delay.connect(wetMixNode);
  wetMixNode.connect(destination);

  //source +-> dryMixNode ------------------------------------*-> destination
  //       `> filter -> feedbackGain -> delay -+> wetMixNode -'
  //            ^------------------------------'
};

const addDistortion = (sources, destination, distortion) => {
  const distortionNode = ctx.createWaveShaper();

  distortionNode.curve = makeDistortionCurve((item) => {
    return Math.pow(Math.sin(item * Math.PI / 2), 1 / distortion);
  });

  distortionNode.oversample = '4x';

  sources.forEach((source) => source.connect(distortionNode));
  distortionNode.connect(destination);
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

module.exports = {addDelay, addDistortion};

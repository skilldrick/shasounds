import _ from 'underscore';
import scales from './scales.js';

const getRandomHexDigit = () => Math.floor(Math.random() * 16).toString(16);

const get = (arr, index) => arr[index % arr.length];

const getRandomSha = () => {
  let sha = '';

  for (let i = 0; i < 40; i++) {
    sha += getRandomHexDigit();
  }

  return sha;
};

const tuneConfig = (sha) => {
  sha = sha || getRandomSha();

  const parts = sha.split('').map((num) => parseInt(num, 16));

  const tune = parts.slice(0, 11);
  const rhythmParts = parts.slice(11, 16);

  const scalePart = parts[16];
  const transpose1 = parts[17];
  const transpose2 = parts[18];

  const scale = get(scales, scalePart);

  // Split each part of rhythmParts in two with bit masking and shifting
  const rhythm = _.flatten(
    rhythmParts.map(
      (part) => [part & 3, part >> 2]
    )
  ).map((part) => part + 1);

  return {
    scaleName: scale.name,
    scale: scale.scale,
    tune: tune,
    rhythm: rhythm,
    transposes: parts.slice(17, 19)
  };
};

module.exports = tuneConfig;

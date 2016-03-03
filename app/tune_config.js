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

// Convert one 4-bit value into two 2-bit values
const splitValue = (value) => [value & 3, value >> 2];

// Convert array of 4-bit values to twice-as-long array of 2-bit values
const splitValues = (values) => _.flatten(
  values.map(splitValue)
);


// sha must be 40 character hex string
const validate = (sha) => sha.match(/^[0-9a-fA-F]{40}$/);

const tuneConfig = (input) => {
  const sha = validate(input) ? input : getRandomSha();

  const parts = sha.split('').map((num) => parseInt(num, 16));

  const tune = parts.slice(0, 11);
  const rhythmParts = parts.slice(11, 16);

  const scalePart = parts[16];
  const transposes = parts.slice(17, 19);

  const [distortion, delayAmount] = splitValue(parts[19]);
  const [delayTime, delayDistortion] = splitValue(parts[20]);

  const scale = get(scales, scalePart);

  const rhythm = splitValues(rhythmParts).map((part) => part + 1);


  return {
    sha: sha,
    scaleName: scale.name,
    scale: scale.scale,
    tune,
    rhythm,
    transposes,
    distortion,
    delayAmount,
    delayTime,
    delayDistortion
  };
};

module.exports = tuneConfig;

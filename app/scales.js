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
];

module.exports = scales;

// const { groth16 } = require('snarkjs');

// async function test() {
//   const { proof, publicSignals } = await groth16.fullProve(
//     {
//       // Public inputs
//       pubGuessA: 1,
//       pubGuessB: 2,
//       pubGuessC: 3,
//       pubGuessD: 4,
//       pubNumHit: 4,
//       pubNumBlow: 4,
//       pubSolnHash: 4,

//       // Private inputs
//       privSolnA: 1,
//       privSolnB: 2,
//       privSolnC: 3,
//       privSolnD: 4,
//       privSalt: 4,
//     },
//     './contracts/circuits/test/hitandblow_js/hitandblow.wasm',
//     './contracts/circuits/test/circuit_final.zkey'
//   );
//   console.log('publicSignals is: ', publicSignals);
//   return;
// }

// test();

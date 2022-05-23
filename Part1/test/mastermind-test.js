//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected

const chai = require('chai');
const path = require('path');
const { groth16 } = require('snarkjs');

const wasm_tester = require('circom_tester').wasm;

// const buildPoseidon = require('circomlibjs').buildPoseidon;

const assert = chai.assert;

describe('System of equations test', function () {
  // let poseidon;
  this.timeout(100000000);

  // before(async () => {
  //   poseidon = await buildPoseidon();
  // });

  it('MastermindVariation', async () => {
    const circuit = await wasm_tester(
      'contracts/circuits/MastermindVariation.circom'
    );
    await circuit.loadConstraints();

    // const circuit2 = await wasm_tester('contracts/circuits/hashCheck.circom');
    // await circuit2.loadConstraints();

    // const hashResult = poseidon([0, 1, 2, 3, 4]);
    // const hashResultFormatted = BigInt(String(hashResult).replace(/,/g, ''));

    let errorCount = 0;
    let successCount = 0;
    let validWitness;
    let validINPUT;

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        // console.log('jsPoseidon output: ', hashResultFormatted);

        // let circomPoseidonOutput = 0n;
        let circomPublicSignal;

        const INPUTPrivate = {
          privSalt: 10 ** 308,
          privSolnA: 2,
          privSolnB: 1,
          privSolnC: 4,
          privSolnD: 5,
        };

        // try {
        //   const witness0 = await circuit2.calculateWitness(INPUTPrivate, true);
        //   circomPoseidonOutput = witness0[witness0.length - 1];
        //   // console.log('circomPoseidon output: ', circomPoseidonOutput);
        // } catch (e) {
        //   // console.log(e);
        //   continue;
        // }

        try {
          const { publicSignals } = await groth16.fullProve(
            { ...INPUTPrivate },
            './contracts/circuits/test3/hashCheck_js/hashCheck.wasm',
            './contracts/circuits/test3/circuit_final.zkey'
          );
          circomPublicSignal = BigInt(publicSignals[0]);
          // console.log('circuitPublicSignals is: ', circomPublicSignal);
        } catch (e) {
          console.log(e);
          continue;
        }

        const INPUT = {
          // Public inputs
          pubGuessA: 0,
          pubGuessB: 1,
          pubGuessC: 2,
          pubGuessD: 5,
          pubNumHit: i,
          pubNumBlow: j,
          pubSolnHash: circomPublicSignal,

          // Private inputs
          ...INPUTPrivate,
        };

        // console.log('INPUT is: ', INPUT);

        try {
          const witness = await circuit.calculateWitness(INPUT, true);
          validWitness = witness;
          successCount++;
          console.log('errorCount is: ', errorCount);
          console.log('successCount is: ', successCount);
          validINPUT = INPUT;
        } catch (e) {
          // console.log(e);
          errorCount++;
          console.log('errorCount is: ', errorCount);
          console.log('successCount is: ', successCount);
          continue;
        }
      }
    }

    await circuit.checkConstraints(validWitness);
    // console.log('checkConstraintsResult is: ', checkConstraintsResult);

    console.log('validWitness is: ', validWitness);
    console.log('validINPUT is: ', validINPUT);
  });
});

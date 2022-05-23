#!/bin/bash

cd contracts/circuits

mkdir test2

if [ -f ./powersOfTau28_hez_final_10.ptau ]; then
    echo "powersOfTau28_hez_final_10.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_10.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau
fi

echo "Compiling testMaxNum.circom..."

# compile circuit

circom testMaxNum.circom --r1cs --wasm --sym -o test2
snarkjs r1cs info test2/testMaxNum.r1cs

# Start a new zkey and make a contribution

snarkjs groth16 setup test2/testMaxNum.r1cs powersOfTau28_hez_final_10.ptau test2/circuit_0000.zkey
snarkjs zkey contribute test2/circuit_0000.zkey test2/circuit_final.zkey --name="1st Contributor Name" -v -e="random text"
snarkjs zkey export verificationkey test2/circuit_final.zkey test2/verification_key.json

# generate solidity contract
snarkjs zkey export solidityverifier test2/circuit_final.zkey ../test2_verifier.sol

cd ../..
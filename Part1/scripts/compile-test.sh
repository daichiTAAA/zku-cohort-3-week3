#!/bin/bash

cd contracts/circuits

mkdir test

if [ -f ./powersOfTau28_hez_final_10.ptau ]; then
    echo "powersOfTau28_hez_final_10.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_10.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau
fi

echo "Compiling hitandblow.circom..."

# compile circuit

circom hitandblow.circom --r1cs --wasm --sym -o test
snarkjs r1cs info test/hitandblow.r1cs

# Start a new zkey and make a contribution

snarkjs groth16 setup test/hitandblow.r1cs powersOfTau28_hez_final_10.ptau test/circuit_0000.zkey
snarkjs zkey contribute test/circuit_0000.zkey test/circuit_final.zkey --name="1st Contributor Name" -v -e="random text"
snarkjs zkey export verificationkey test/circuit_final.zkey test/verification_key.json

# generate solidity contract
snarkjs zkey export solidityverifier test/circuit_final.zkey ../test_verifier.sol

cd ../..
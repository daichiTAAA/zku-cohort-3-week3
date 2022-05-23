#!/bin/bash

cd contracts/circuits

mkdir test3

if [ -f ./powersOfTau28_hez_final_10.ptau ]; then
    echo "powersOfTau28_hez_final_10.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_10.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau
fi

echo "Compiling hashCheck.circom..."

# compile circuit

circom hashCheck.circom --r1cs --wasm --sym -o test3
snarkjs r1cs info test3/hashCheck.r1cs

# Start a new zkey and make a contribution

snarkjs groth16 setup test3/hashCheck.r1cs powersOfTau28_hez_final_10.ptau test3/circuit_0000.zkey
snarkjs zkey contribute test3/circuit_0000.zkey test3/circuit_final.zkey --name="1st Contributor Name" -v -e="random text"
snarkjs zkey export verificationkey test3/circuit_final.zkey test3/verification_key.json

# generate solidity contract
# snarkjs zkey export solidityverifier test3/circuit_final.zkey ../test3_verifier.sol

cd ../..
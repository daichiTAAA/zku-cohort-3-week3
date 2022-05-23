pragma circom 2.0.0;

template testMaxNum() {
  signal input in1;
  signal input in2;

  signal output out;

  var out1 = in1 * in2;
  var out2 = out1 * 1;

  out <== out2;
}

component main = testMaxNum();
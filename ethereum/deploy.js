const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFlappy = require("./build/Flappy.json");

const provider = new HDWalletProvider(
  "harsh park detail will engine rocket coffee change exhaust avoid volcano virtual",
  // remember to change this to your own phrase!
  "https://data-seed-prebsc-1-s1.binance.org:8545"
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(compiledFlappy.abi)
    .deploy({ data: compiledFlappy.evm.bytecode.object })
    .send({ gas: "1400000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();
import web3 from "./web3.js";
const compiledFlappy = require("./build/Flappy.json");

const instance = new web3.eth.Contract(
  compiledFlappy.abi,
  "0x343811a16d4Fa51097b0938029CFa0d483D1C82b"
);

export default instance;
 
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const ETHDaddy = await hre.ethers.getContractFactory("ETHDaddy");
  const ethDaddy = await ETHDaddy.deploy();
  await ethDaddy.deployed();

  console.log(`Deployed contract at: ${ethDaddy.address}\n`);

  // List 6 domains
  const names = [
    "sami.eth",
    "naruto.eth",
    "straw.eth",
    "supra.eth",
    "hell.eth",
    "omen.eth",
  ];
  const costs = [
    tokens(50),
    tokens(25),
    tokens(15),
    tokens(2.5),
    tokens(3),
    tokens(15),
  ];

  for (var i = 0; i < 6; i++) {
    const transaction = await ethDaddy
      .connect(deployer)
      .listOfDomain(names[i], costs[i]);
    await transaction.wait();

    console.log(`Listed Domain ${i + 1}: ${names[i]}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

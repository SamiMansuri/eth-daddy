const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("ETHDaddy", () => {
  let ethDaddy, deployer, owner1;
  beforeEach(async () => {
    [deployer, owner1] = await ethers.getSigners();
    // console.log(deployer.address);
    // console.log(owner1.address);
    const ETHDaddy = await ethers.getContractFactory("ETHDaddy");
    ethDaddy = await ETHDaddy.deploy();

    // List a Domain
    const transaction = await ethDaddy
      .connect(deployer)
      .listOfDomain("sami.eth", tokens(10));
    await transaction.wait();
  });
  describe("deployment", () => {
    it("has a name", async () => {
      const result = await ethDaddy.name();
      expect(result).to.equal("ETH Daddy");
    });

    it("has a symbol", async () => {
      const result = await ethDaddy.symbol();
      expect(result).to.equal("ETHD");
    });

    it("Sets the owner", async () => {
      const result = await ethDaddy.getOwner();
      expect(result).to.equal(deployer.address);
    });
  });

  describe("domain", () => {
    it("Returs domain attribute", async () => {
      let domain = await ethDaddy.getDomain(1);
      expect(domain.name).to.be.equal("sami.eth");
    });
  });

  describe("minting", () => {
    const ID = 1;
    const AMOUNT = ethers.utils.parseUnits("10", "ether");
    beforeEach(async () => {
      const transaction = await ethDaddy
        .connect(owner1)
        .mint(ID, { value: AMOUNT });
      await transaction.wait();
    });
    it("Updates the owner", async () => {
      const owner = await ethDaddy.ownerOf(ID);
      expect(owner).to.be.equal(owner1.address);
    });

    it("Updates the contract balance", async () => {
      const result = await ethDaddy.getBalance();
      expect(result).to.be.equal(AMOUNT);
    });

    // it("Is minted", async () => {
    //   const transaction = await ethDaddy
    //     .connect(owner1)
    //     .mint(2, { value: AMOUNT });
    //   await transaction.wait();
    // });
  });
  describe("Withdrawing", () => {
    const ID = 1;
    const AMOUNT = ethers.utils.parseUnits("10", "ether");
    let balanceBefore;

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      let transaction = await ethDaddy
        .connect(owner1)
        .mint(ID, { value: AMOUNT });
      await transaction.wait();

      transaction = await ethDaddy.connect(deployer).withdraw();
      await transaction.wait();
    });

    it("Updates the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("Updates the contract balance", async () => {
      const result = await ethDaddy.getBalance();
      expect(result).to.equal(0);
    });
  });
});

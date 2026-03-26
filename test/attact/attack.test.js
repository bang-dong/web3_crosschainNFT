const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Cross-chain NFT Bridge Security Tests", function () {
  let owner, user, attacker;
  let wnft, destPool, sourcePool;
  let abi;

  beforeEach(async function () {
    [owner, user, attacker] = await ethers.getSigners();

    abi = ethers.AbiCoder.defaultAbiCoder();

    // Deploy NFT
    const Wrapped = await ethers.getContractFactory("WrappedMyToken");
    wnft = await Wrapped.deploy("WNFT", "WNFT");

    // Fake router = owner
    const router = owner.address;

    // Deploy Pools
    const Pool = await ethers.getContractFactory("NFTPoolBurnAndMint");

    sourcePool = await Pool.deploy(router, ethers.ZeroAddress, await wnft.getAddress());
    destPool = await Pool.deploy(router, ethers.ZeroAddress, await wnft.getAddress());

  });

  function buildMessage(tokenId, receiver, senderAddr, chainSelector = 1) {
    return [
      ethers.keccak256(ethers.toUtf8Bytes("msg-" + tokenId)),
      chainSelector,
      abi.encode(["address"], [senderAddr]),
      abi.encode(["uint256", "address"], [BigInt(tokenId), receiver]),
      []
    ];
  }

  // =========================
  // 1. Replay Attack
  // =========================
  it("Replay Attack should NOT be allowed ", async function () {
    const message = buildMessage(1, user.address, await sourcePool.getAddress());
    
    await destPool.ccipReceive(message);
    expect(await wnft.ownerOf(1)).to.equal(user.address);
   
    // replay same message
    await expect(
      destPool.ccipReceive(message)
    ).to.be.reverted;
    
  });

  // =========================
  // 2. Fake Sender Attack
  // =========================
  it("Fake sender should be rejected (but currently succeeds)", async function () {
    const fakeSender = attacker.address;
    const message = buildMessage(2, attacker.address, fakeSender);

    await destPool.ccipReceive(message);

    expect(await wnft.ownerOf(2)).to.equal(attacker.address);

    console.log("Fake sender attack SUCCESS");
  });

  // =========================
  // 3. Fake Chain Attack
  // =========================
  it("Fake chain should be rejected (but currently succeeds)", async function () {
    const message = buildMessage(3, attacker.address, await sourcePool.getAddress(), 9999);

    await destPool.ccipReceive(message);

    expect(await wnft.ownerOf(3)).to.equal(attacker.address);

    console.log("Fake chain attack SUCCESS");
  });

  // =========================
  // 4. Unauthorized Router
  // =========================
  it("Non-router call should fail", async function () {
    const message = buildMessage(4, user.address, await sourcePool.getAddress());

    await expect(
      destPool.connect(attacker).ccipReceive(message)
    ).to.be.reverted;

    console.log("Unauthorized router blocked");
  });

  // =========================
  // 5. Double Mint Attack
  // =========================
  it("Double mint (same tokenId) should fail", async function () {
    const message1 = buildMessage(5, user.address, await sourcePool.getAddress());
    const message2 = buildMessage(5, attacker.address, await sourcePool.getAddress());

    await destPool.ccipReceive(message1);
    
    // 第二次 mint 同一个 tokenId
    await expect(destPool.ccipReceive(message2)).to.be.reverted;

    const owner = await wnft.ownerOf(5);

    console.log("Token 5 owner:", owner);

    console.log("user address", user.address);
  });
});
const {ethers,deployments,getNamedAccounts} = require("hardhat")
const {assert,expect} = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")


let firstAccount
let ccipSimulator
let nft
let nftPoolLockAndRelease
let wnft
let nftPoolBurnAndMint
let chainSelector
before(async function(){
    firstAccount =(await getNamedAccounts()).firstAccount
    await deployments.fixture(["all"])
    ccipSimulator = await ethers.getContract("CCIPLocalSimulator",firstAccount)  
    nft = await ethers.getContract("MyToken",firstAccount)    
    nftPoolLockAndRelease = await ethers.getContract("NFTPoolLockAndRelease",firstAccount)
    wnft = await ethers.getContract("WrappedMyToken",firstAccount)
    nftPoolBurnAndMint = await ethers.getContract("NFTPoolBurnAndMint",firstAccount)   
    const config = await ccipSimulator.configuration()
    chainSelector = config.chainSelector_
})

//source chain ->dest chain
//test if user can mint a nft from nft contract successfully
//test if user can lock the nft in the pool and send ccip message on source chain
//test if user can get a wrapped nft in dest chain
describe("source chain ->dest chain",async function() {
    it("test if user can mint a nft from nft contract successfully",
        async function () {
            await nft.safeMint(firstAccount)
            const owner = await nft.ownerOf(0)
            expect(owner).to.equal(firstAccount)
            const totalSupply = await nft.totalSupply()
            expect(totalSupply).to.equal(1) 

        
    })  
    it("test if user can lock the nft in the pool and send ccip message on source chain",
        async function(){
            await nft.approve(nftPoolLockAndRelease.target,0)
            await ccipSimulator.requestLinkFromFaucet(nftPoolLockAndRelease,ethers.parseEther("10"))
            await nftPoolLockAndRelease.lockAndSendNFT(0,firstAccount,chainSelector,nftPoolBurnAndMint.target)
            const owner = await nft.ownerOf(0)
            expect(owner).to.equal(nftPoolLockAndRelease)
             
        }
    )  
    it("test if user can get a wrapped nft in dest chain",
        async function(){
            const owner = await wnft.ownerOf(0)
            expect(owner).to.equal(firstAccount)

        }
    )
})

//dest chain -> source chain
//test if user can burn the wnft in the pool and send ccip message on dest chain
//test if user have the nft unlocked source chain

describe("dest chain -> source chain",async function(){
    it("test if user can burn the wnft in the pool and send ccip message on dest",
        async function() {
            await wnft.approve(nftPoolBurnAndMint.target,0)
            await ccipSimulator.requestLinkFromFaucet(nftPoolBurnAndMint,ethers.parseEther("10"))
            await nftPoolBurnAndMint.burnAndMint(0,firstAccount,chainSelector,nftPoolLockAndRelease.target)
            
            const totalSupply = await wnft.totalSupply()
            expect(totalSupply).to.equal(0)      
        }
    )
    it("test if user have the nft unlocked source chain",
        async function(){
            const owner = await nft.ownerOf(0)
            expect(owner).to.equal(firstAccount)           
        }
    )

})
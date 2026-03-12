const { getNamedAccounts, deployments,ethers } = require("hardhat");

module.exports = async({getNamedAccounts,deployments})=>{
    const {firstAccount} = await getNamedAccounts()
    const {deploy,log} = await deployments
    log("Deploying nftpoolburnandmint contract")
    //address _router, address _link, address nftAddr
    const ccipSimulatorDeloyment = await deployments.get("CCIPLocalSimulator")
    const ccipSimulator = await ethers.getContractAt("CCIPLocalSimulator",ccipSimulatorDeloyment.address)
    const ccipConfig = await ccipSimulator.configuration()
    const destChainRouter = ccipConfig.destinationRouter_
    const linkTokenAddr = ccipConfig.linkToken_
    const wnftDeployment = await deployments.get("WrappedMyToken")
    const wnftAddr = wnftDeployment.address
   
    await deploy("NFTPoolBurnAndMint",{
        contract:"NFTPoolBurnAndMint",
        from: firstAccount,
        log:true,
        args:[destChainRouter,linkTokenAddr,wnftAddr]
    })
    log("nftpoolburnandmint contract deployed successfully")
}

module.exports.tags = ["destchain","all"]
const { getNamedAccounts, deployments,ethers } = require("hardhat");
module.exports = async({getNamedAccounts,deployments})=>{
    const {firstAccount} = await getNamedAccounts()
    const {deploy,log} = await deployments
    log("Deploying nftpoollockandrelease contract")
    //address _router, address _link, address nftAddr
    const ccipSimulatorDeloyment = await deployments.get("CCIPLocalSimulator")
    const ccipSimulator = await ethers.getContractAt("CCIPLocalSimulator",ccipSimulatorDeloyment.address)
    const ccipConfig = await ccipSimulator.configuration()
    const sourceChainRouter = ccipConfig.sourceRouter_
    const linkTokenAddr = ccipConfig.linkToken_
    const nftDeployment = await deployments.get("MyToken")
    const nftAddr = nftDeployment.address
   
    await deploy("NFTPoolLockAndRelease",{
        contract:"NFTPoolLockAndRelease",
        from: firstAccount,
        log:true,
        args:[sourceChainRouter,linkTokenAddr,nftAddr]
    })
    log("nftpoollockandrelease contract deployed successfully")
}

module.exports.tags = ["sourcechain","all"]
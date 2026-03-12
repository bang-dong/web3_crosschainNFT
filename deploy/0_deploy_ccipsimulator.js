const { getNamedAccounts, deployments } = require("hardhat");

module.exports = async({getNamedAccounts,deployments})=>{
    const {firstAccount} = await getNamedAccounts()
    const {deploy,log} = await deployments
    log("Deploying ccip simulator contract")
    await deploy("CCIPLocalSimulator",{
        contract:"CCIPLocalSimulator",
        from: firstAccount,
        log:true,
        args:[]
    })
    log("ccip simulator contract deployed successfully")
}

module.exports.tags = ["test","all"]
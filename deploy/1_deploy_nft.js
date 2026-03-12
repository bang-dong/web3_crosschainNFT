const { getNamedAccounts, deployments } = require("hardhat");

module.exports = async({getNamedAccounts,deployments})=>{
    const {firstAccount} = await getNamedAccounts()
    const {deploy,log} = await deployments
    log("Deploying nft contract")
    await deploy("MyToken",{
        contract:"MyToken",
        from: firstAccount,
        log:true,
        args:["Mytoken","MT"]
    })
    log("nft contract deployed successfully")
}

module.exports.tags = ["sourcechain","all"]
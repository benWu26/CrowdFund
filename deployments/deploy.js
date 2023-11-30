async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    const title = "Razer";
    const description = "Help create new gaming stuff";

    const token = await ethers.deployContract("crowdFund",[title, description]);

    console.log("Token address:", await token.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
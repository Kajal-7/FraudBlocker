async function main() {
  const [deployer] = await ethers.getSigners()

  console.log('Deploying contracts with the account:', deployer.address)

  console.log('Account balance:', (await deployer.getBalance()).toString())

  const ProductAuthentication = await ethers.getContractFactory(
    'ProductAuthentication'
  )
  const productAuthentication = await ProductAuthentication.deploy()

  console.log('ProductAuthentication address:', productAuthentication.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

const {
  time,
  loadFixture,
} = require('@nomicfoundation/hardhat-network-helpers')
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs')
const { expect, assert } = require('chai')

describe('ProductAuthentication', () => {
  const deployProductAuthenticationFixture = async () => {
    const [owner, otherAccount, otherAccount2, otherAccount3] =
      await ethers.getSigners()

    const ProductAuthentication = await ethers.getContractFactory(
      'ProductAuthentication'
    )
    const productAuthentication = await ProductAuthentication.deploy()

    return {
      owner,
      otherAccount,
      otherAccount2,
      otherAccount3,
      productAuthentication,
    }
  }

  describe('function createManufacturer', () => {
    it('can create a manufacturer', async () => {
      const { productAuthentication, owner } =
        await deployProductAuthenticationFixture()
      await productAuthentication.connect(owner).createManufacturer(
        'man_1_name',
        'man_1_location',
        'man_1_timestamp'
      )
    })

    it("can't create a manufacturer on the same address", async () => {
      const { productAuthentication } =
        await deployProductAuthenticationFixture()
      await productAuthentication.createManufacturer(
        'man_1_name',
        'man_1_location',
        'man_1_timestamp'
      )
      await expect(
        productAuthentication.createManufacturer(
          'man_2_name',
          'man_2_location',
          'man_2_timestamp'
        )
      ).to.be.revertedWith('manufacturer already exists')
    })
  })

  describe('function createRetailer', () => {
    it('can create a retailer', async () => {
      const { productAuthentication } =
        await deployProductAuthenticationFixture()
      await productAuthentication.createRetailer('ret_1_name', 'ret_1_location')
    })

    it("can't create a retailer on the same address", async () => {
      const { productAuthentication } =
        await deployProductAuthenticationFixture()
      await productAuthentication.createRetailer('ret_1_name', 'ret_1_location')
      await expect(
        productAuthentication.createRetailer('ret_2_name', 'ret_2_location')
      ).to.be.revertedWith('retailer already exists')
    })
  })

  describe('function createCustomer', () => {
    it('can create a customer', async () => {
      const { productAuthentication } =
        await deployProductAuthenticationFixture()
      await productAuthentication.createCustomer('cus_1_name', 'cus_1_phone')
    })

    it("can't create a customer on the same address", async () => {
      const { productAuthentication } =
        await deployProductAuthenticationFixture()
      await productAuthentication.createCustomer('cus_1_name', 'cus_1_phone')
      await expect(
        productAuthentication.createCustomer('cus_2_name', 'cus_2_phone')
      ).to.be.revertedWith('customer already exists')
    })
  })

  describe('function createProduct', () => {
    it('can create a product', async () => {
      const { productAuthentication, owner } =
        await deployProductAuthenticationFixture()

      await productAuthentication
        .connect(owner)
        .createManufacturer('man_1_name', 'man_1_location', 'man_1_timestamp')
      await productAuthentication
        .connect(owner)
        .createProduct(
          'pro_1_hash',
          'pro_1_brand',
          'pro_1_model',
          'pro_1_description'
        )
      await productAuthentication.getProductDetails('pro_1_hash');
      // check in map
    })

    it('only manufacturer can create product', async () => {
      const { productAuthentication } =
        await deployProductAuthenticationFixture()
      await expect(
        productAuthentication.createProduct(
          'pro_1_hash',
          'pro_1_brand',
          'pro_1_model',
          'pro_1_description'
        )
      ).to.be.revertedWith("manufacturer doesn't exist")
    })

    it("can't create product with same hash", async () => {
      const { productAuthentication } =
        await deployProductAuthenticationFixture()

      await productAuthentication.createManufacturer(
        'man_1_name',
        'man_1_location',
        'man_1_timestamp'
      )

      await productAuthentication.createProduct(
        'pro_1_hash',
        'pro_1_brand',
        'pro_1_model',
        'pro_1_description'
      )

      await expect(
        productAuthentication.createProduct(
          'pro_1_hash',
          'pro_2_brand',
          'pro_2_model',
          'pro_2_description'
        )
      ).to.be.revertedWith('product already exists')
    })
  })

  describe('function addRetailerToProduct', () => {
    it('can add retailer to a product', async () => {
      const { productAuthentication, owner, otherAccount } =
        await deployProductAuthenticationFixture()

      await productAuthentication.createManufacturer(
        'man_1_name',
        'man_1_location',
        'man_1_timestamp'
      )

      await productAuthentication
        .connect(otherAccount)
        .createRetailer('ret_1_name', 'ret_1_location')

      await productAuthentication.createProduct(
        'pro_1_hash',
        'pro_1_brand',
        'pro_1_model',
        'pro_1_description'
      )

      await productAuthentication.addRetailerToProduct(
        'pro_1_hash',
        otherAccount.address
      )

      const productDetails = await productAuthentication.getProductDetails(
        'pro_1_hash'
      )

      expect(productDetails[5].name).to.equal('ret_1_name')
    })

    it('only manufacturer can add retailer to a product', async () => {
      const { productAuthentication, owner, otherAccount, otherAccount2 } =
        await deployProductAuthenticationFixture()

      await productAuthentication.createManufacturer(
        'man_1_name',
        'man_1_location',
        'man_1_timestamp'
      )

      await productAuthentication
        .connect(otherAccount)
        .createRetailer('ret_1_name', 'ret_1_location')

      await productAuthentication.createProduct(
        'pro_1_hash',
        'pro_1_brand',
        'pro_1_model',
        'pro_1_description'
      )

      await expect(
        productAuthentication
          .connect(otherAccount2)
          .addRetailerToProduct('pro_1_hash', otherAccount.address)
      ).to.be.revertedWith("you aren't the manufacturer of this product")
    })

    it("can't add retailer to a product when product is stolen", async () => {
      const { productAuthentication, owner, otherAccount } =
        await deployProductAuthenticationFixture()

      await productAuthentication.createManufacturer(
        'man_1_name',
        'man_1_location',
        'man_1_timestamp'
      )

      await productAuthentication
        .connect(otherAccount)
        .createRetailer('ret_1_name', 'ret_1_location')

      await productAuthentication.createProduct(
        'pro_1_hash',
        'pro_1_brand',
        'pro_1_model',
        'pro_1_description'
      )

      await productAuthentication.markProductAsStolen('pro_1_hash')

      await expect(
        productAuthentication.addRetailerToProduct(
          'pro_1_hash',
          otherAccount.address
        )
      ).to.be.revertedWith('product is stolen')
    })

    it('can only add retailer to a product when retailer exists', async () => {
      const { productAuthentication, owner, otherAccount } =
        await deployProductAuthenticationFixture()

      await productAuthentication.createManufacturer(
        'man_1_name',
        'man_1_location',
        'man_1_timestamp'
      )

      await productAuthentication.createProduct(
        'pro_1_hash',
        'pro_1_brand',
        'pro_1_model',
        'pro_1_description'
      )

      await expect(
        productAuthentication.addRetailerToProduct(
          'pro_1_hash',
          otherAccount.address
        )
      ).to.be.revertedWith("retailer doesn't exist")
    })
  })

  describe('function getProductDetails', () => {
    it('can fetch product details', async () => {
      const { productAuthentication, owner, otherAccount } =
        await deployProductAuthenticationFixture()
      await productAuthentication.createManufacturer(
        'man_1_name',
        'man_1_location',
        'man_1_timestamp'
      )

      await productAuthentication.createProduct(
        'pro_1_hash',
        'pro_1_brand',
        'pro_1_model',
        'pro_1_description'
      )

      const productDetails = await productAuthentication.getProductDetails('pro_1_hash');
      expect(productDetails[0]).to.equal(1);
      expect(productDetails[1]).to.equal('pro_1_brand');
      expect(productDetails[2]).to.equal('pro_1_model');
      expect(productDetails[3]).to.equal('pro_1_description');
    })

    it('can fetch product details only when product exists', async () => {
      const { productAuthentication } =
        await deployProductAuthenticationFixture()
      await expect(
        productAuthentication.getProductDetails('pro_1_hash')
      ).to.be.revertedWith("product doesn't exist")
    })
  })

  describe('function transferFromRetailerToInitialOwner', () => {
    it('can transfer from retailer to first owner', async () => {
      const { productAuthentication, owner, otherAccount, otherAccount2 } =
        await deployProductAuthenticationFixture()

      await productAuthentication.createManufacturer(
        'man_1_name',
        'man_1_location',
        'man_1_timestamp'
      )

      await productAuthentication.createProduct(
        'pro_1_hash',
        'pro_1_brand',
        'pro_1_model',
        'pro_1_description'
      )

      await productAuthentication
        .connect(otherAccount)
        .createRetailer('ret_1_name', 'ret_1_location')

      await productAuthentication
        .connect(otherAccount2)
        .createCustomer('cus_1_name', 'cus_1_phone')

      await productAuthentication.addRetailerToProduct(
        'pro_1_hash',
        otherAccount.address
      )

      await productAuthentication
        .connect(otherAccount)
        .transferFromRetailerToIntialOwner('pro_1_hash', otherAccount2.address)

      const productDetails = await productAuthentication.getProductDetails('pro_1_hash');
      // checking the first customer of the product
      expect(productDetails[6][0].name).to.equal('cus_1_name');
    })

    it('can transfer from retailer to first owner only when product is not stolen', async () => {
      const { productAuthentication, owner, otherAccount, otherAccount2 } =
        await deployProductAuthenticationFixture()

      await productAuthentication.createManufacturer(
        'man_1_name',
        'man_1_location',
        'man_1_timestamp'
      )

      await productAuthentication.createProduct(
        'pro_1_hash',
        'pro_1_brand',
        'pro_1_model',
        'pro_1_description'
      )

      await productAuthentication
        .connect(otherAccount)
        .createRetailer('ret_1_name', 'ret_1_location')

      await productAuthentication
        .connect(otherAccount2)
        .createCustomer('cus_1_name', 'cus_1_phone')

      await productAuthentication.addRetailerToProduct(
        'pro_1_hash',
        otherAccount.address
      )

      await productAuthentication
        .connect(otherAccount)
        .markProductAsStolen('pro_1_hash')

      await expect(
        productAuthentication
          .connect(otherAccount)
          .transferFromRetailerToIntialOwner(
            'pro_1_hash',
            otherAccount2.address
          )
      ).to.be.revertedWith('product is stolen')
    })

    it('can transfer from retailer to first owner only when customer exists', async () => {
      const { productAuthentication, owner, otherAccount, otherAccount2 } =
        await deployProductAuthenticationFixture()

      await productAuthentication.createManufacturer(
        'man_1_name',
        'man_1_location',
        'man_1_timestamp'
      )

      await productAuthentication.createProduct(
        'pro_1_hash',
        'pro_1_brand',
        'pro_1_model',
        'pro_1_description'
      )

      await productAuthentication
        .connect(otherAccount)
        .createRetailer('ret_1_name', 'ret_1_location')

      await productAuthentication.addRetailerToProduct(
        'pro_1_hash',
        otherAccount.address
      )

      await expect(
        productAuthentication
          .connect(otherAccount)
          .transferFromRetailerToIntialOwner(
            'pro_1_hash',
            otherAccount2.address
          )
      ).to.be.revertedWith("customer doesn't exist")
    })

    it('can transfer from retailer to first owner only when retailer is calling', async () => {
      const { productAuthentication, owner, otherAccount, otherAccount2 } =
        await deployProductAuthenticationFixture()

      await productAuthentication.createManufacturer(
        'man_1_name',
        'man_1_location',
        'man_1_timestamp'
      )

      await productAuthentication.createProduct(
        'pro_1_hash',
        'pro_1_brand',
        'pro_1_model',
        'pro_1_description'
      )

      await productAuthentication
        .connect(otherAccount)
        .createRetailer('ret_1_name', 'ret_1_location')

      await productAuthentication
        .connect(otherAccount2)
        .createCustomer('cus_1_name', 'cus_1_phone')

      await productAuthentication.addRetailerToProduct(
        'pro_1_hash',
        otherAccount.address
      )

      await expect(
        productAuthentication.transferFromRetailerToIntialOwner(
          'pro_1_hash',
          otherAccount2.address
        )
      ).to.be.revertedWith("you aren't the retailer of this product")
    })
  })

  describe('function transferOwnershipFromCustomer', () => {
    it('can transfer ownership from owner to new owner', async () => {
      const {
        productAuthentication,
        owner,
        otherAccount,
        otherAccount2,
        otherAccount3,
      } = await deployProductAuthenticationFixture()

      await productAuthentication.createManufacturer(
        'man_1_name',
        'man_1_location',
        'man_1_timestamp'
      )

      await productAuthentication.createProduct(
        'pro_1_hash',
        'pro_1_brand',
        'pro_1_model',
        'pro_1_description'
      )

      await productAuthentication
        .connect(otherAccount)
        .createRetailer('ret_1_name', 'ret_1_location')

      await productAuthentication
        .connect(otherAccount2)
        .createCustomer('cus_1_name', 'cus_1_phone')

      await productAuthentication
        .connect(otherAccount3)
        .createCustomer('cus_2_name', 'cus_2_phone')

      await productAuthentication.addRetailerToProduct(
        'pro_1_hash',
        otherAccount.address
      )

      await productAuthentication
        .connect(otherAccount)
        .transferFromRetailerToIntialOwner('pro_1_hash', otherAccount2.address)

      await productAuthentication
        .connect(otherAccount2)
        .transferOwnershipFromCustomer('pro_1_hash', otherAccount3.address)
      
      const productDetails = await productAuthentication.getProductDetails('pro_1_hash');
      expect(productDetails[6][0].name).to.equal('cus_1_name');
      expect(productDetails[6][1].name).to.equal('cus_2_name');
    })

    it('can transfer ownership from owner to new owner only when new owner exists', async () => {
      const {
        productAuthentication,
        owner,
        otherAccount,
        otherAccount2,
        otherAccount3,
      } = await deployProductAuthenticationFixture()

      await productAuthentication.createManufacturer(
        'man_1_name',
        'man_1_location',
        'man_1_timestamp'
      )

      await productAuthentication.createProduct(
        'pro_1_hash',
        'pro_1_brand',
        'pro_1_model',
        'pro_1_description'
      )

      await productAuthentication
        .connect(otherAccount)
        .createRetailer('ret_1_name', 'ret_1_location')

      await productAuthentication
        .connect(otherAccount2)
        .createCustomer('cus_1_name', 'cus_1_phone')

      await productAuthentication.addRetailerToProduct(
        'pro_1_hash',
        otherAccount.address
      )

      await productAuthentication
        .connect(otherAccount)
        .transferFromRetailerToIntialOwner('pro_1_hash', otherAccount2.address)

      await expect(
        productAuthentication
          .connect(otherAccount2)
          .transferOwnershipFromCustomer('pro_1_hash', otherAccount3.address)
      ).to.be.revertedWith("customer doesn't exist")
    })

    it('can transfer ownership from owner to new owner only when product is not stolen', async () => {
      const {
        productAuthentication,
        owner,
        otherAccount,
        otherAccount2,
        otherAccount3,
      } = await deployProductAuthenticationFixture()

      await productAuthentication.createManufacturer(
        'man_1_name',
        'man_1_location',
        'man_1_timestamp'
      )

      await productAuthentication.createProduct(
        'pro_1_hash',
        'pro_1_brand',
        'pro_1_model',
        'pro_1_description'
      )

      await productAuthentication
        .connect(otherAccount)
        .createRetailer('ret_1_name', 'ret_1_location')

      await productAuthentication
        .connect(otherAccount2)
        .createCustomer('cus_1_name', 'cus_1_phone')

      await productAuthentication
        .connect(otherAccount3)
        .createCustomer('cus_2_name', 'cus_2_phone')

      await productAuthentication.addRetailerToProduct(
        'pro_1_hash',
        otherAccount.address
      )

      await productAuthentication
        .connect(otherAccount)
        .transferFromRetailerToIntialOwner('pro_1_hash', otherAccount2.address)

      await productAuthentication
        .connect(otherAccount2)
        .markProductAsStolen('pro_1_hash')

      await expect(
        productAuthentication
          .connect(otherAccount2)
          .transferOwnershipFromCustomer('pro_1_hash', otherAccount3.address)
      ).to.be.revertedWith('product is stolen')
    })

    it('can transfer ownership from owner to new owner only when owner is calling', async () => {
      const {
        productAuthentication,
        owner,
        otherAccount,
        otherAccount2,
        otherAccount3,
      } = await deployProductAuthenticationFixture()

      await productAuthentication.createManufacturer(
        'man_1_name',
        'man_1_location',
        'man_1_timestamp'
      )

      await productAuthentication.createProduct(
        'pro_1_hash',
        'pro_1_brand',
        'pro_1_model',
        'pro_1_description'
      )

      await productAuthentication
        .connect(otherAccount)
        .createRetailer('ret_1_name', 'ret_1_location')

      await productAuthentication
        .connect(otherAccount2)
        .createCustomer('cus_1_name', 'cus_1_phone')

      await productAuthentication
        .connect(otherAccount3)
        .createCustomer('cus_2_name', 'cus_2_phone')

      await productAuthentication.addRetailerToProduct(
        'pro_1_hash',
        otherAccount.address
      )

      await productAuthentication
        .connect(otherAccount)
        .transferFromRetailerToIntialOwner('pro_1_hash', otherAccount2.address)

      await expect(
        productAuthentication
          .connect(otherAccount)
          .transferOwnershipFromCustomer('pro_1_hash', otherAccount3.address)
      ).to.be.revertedWith("you aren't the owner of this product")
    })
  })

  describe('function markProductAsStolen', () => {
    it('can mark product as stolen', async () => {
      const { productAuthentication } =
        await deployProductAuthenticationFixture()

      await productAuthentication.createManufacturer(
        'man_1_name',
        'man_1_location',
        'man_1_timestamp'
      )

      await productAuthentication.createProduct(
        'pro_1_hash',
        'pro_1_brand',
        'pro_1_model',
        'pro_1_description'
      )

      await productAuthentication.markProductAsStolen('pro_1_hash')

      const productDetails = await productAuthentication.getProductDetails(
        'pro_1_hash'
      )

      expect(productDetails[0]).to.equal(2)
    })

    it('can mark product as stolen only when product exists', async () => {
      const { productAuthentication } =
        await deployProductAuthenticationFixture()

      await productAuthentication.createManufacturer(
        'man_1_name',
        'man_1_location',
        'man_1_timestamp'
      )

      await expect(
        productAuthentication.markProductAsStolen('pro_1_hash')
      ).to.be.revertedWith("product doesn't exist")
    })

    it('can mark product as stolen only when owner is calling', async () => {
      const { productAuthentication, otherAccount } =
        await deployProductAuthenticationFixture()

      await productAuthentication.createManufacturer(
        'man_1_name',
        'man_1_location',
        'man_1_timestamp'
      )

      await productAuthentication.createProduct(
        'pro_1_hash',
        'pro_1_brand',
        'pro_1_model',
        'pro_1_description'
      )

      await expect(
        productAuthentication
          .connect(otherAccount)
          .markProductAsStolen('pro_1_hash')
      ).to.be.revertedWith("you aren't the owner of this product")

    })   
  })

  describe('function whoIsTheUser', () => {
    it('user is a manufacturer', async () => {
      const { productAuthentication, owner } =
        await deployProductAuthenticationFixture()
      await productAuthentication.connect(owner).createManufacturer(
        'man_1_name',
        'man_1_location',
        'man_1_timestamp'
      )
      const user = await productAuthentication.whoIsTheUser(owner.address);
      expect(user).to.equal("manufacturer");
    })
    it('user is a customer', async () => {
      const { productAuthentication, owner} =
        await deployProductAuthenticationFixture()
      await productAuthentication.connect(owner).createCustomer('cus_1_name', 'cus_1_phone')
      const user = await productAuthentication.whoIsTheUser(owner.address);
      expect(user).to.equal("customer");
    })
    it('user is a retailer', async () => {
      const { productAuthentication, owner } =
        await deployProductAuthenticationFixture()
      await productAuthentication.connect(owner).createRetailer('ret_1_name', 'ret_1_location')
      const user = await productAuthentication.whoIsTheUser(owner.address);
      expect(user).to.equal("retailer"); 
    })
    it("new user", async()=>{
      const{productAuthentication, owner} = await deployProductAuthenticationFixture()
      const user = await productAuthentication.whoIsTheUser(owner.address);
      expect(user).to.equal("new");
    })
    
  })
})

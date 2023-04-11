//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract ProductAuthentication{

    //Data for testing

    //Set 1
    //create manufacturer - "man_1_name", "man_1_location", "man_1_timestamp"
    //create retailer - "ret_1_name" , "ret_1_location"
    //create customer - "cus_1_name" , "cus_1_phone"
    //create product - "pro_1_hash" , "pro_1_brand" , "pro_1_model" , "pro_1_description"
    //add retailer to product - "pro_1_hash" , {retailer address}
    //get product details - "pro_1_hash"
    //transfer from retailer to owner - "pro_1_hash" , {new owner address}
    //transfer from current owner to new owner - "pro_1_hash" , {new owner address}
    
    //Set 2
    //create manufacturer - "man_2_name", "man_2_location", "man_2_timestamp"
    //create retailer - "ret_2_name" , "ret_2_location"
    //create customer - "cus_2_name" , "cus_2_phone"
    //create product - "pro_2_hash" , "pro_2_brand" , "pro_2_model" , "pro_2_description"
    //add retailer to product - "pro_2_hash" , {retailer address}
    //get product details - "pro_2_hash"
    //transfer from retailer to owner - "pro_2_hash" , {new owner address}
    //transfer from current owner to new owner - "pro_2_hash" , {new owner address}

    //Set 3
    //create manufacturer - "man_3_name", "man_3_location", "man_3_timestamp"
    //create retailer - "ret_3_name" , "ret_3_location"
    //create customer - "cus_3_name" , "cus_3_phone"
    //create product - "pro_3_hash" , "pro_3_brand" , "pro_3_model" , "pro_3_description"
    //add retailer to product - "pro_3_hash" , {retailer address}
    //get product details - "pro_3_hash"
    //transfer from retailer to owner - "pro_3_hash" , {new owner address}
    //transfer from current owner to new owner - "pro_3_hash" , {new owner address}


    //owner of the contract
    address owner;

    //defines a single product
    struct Product{
        uint status; // 1 means valid product, 2 means product is stolen
        string brand;
        string model;
        string description;
        address manufacturerAddress;
        address retailerAddress;
        address[] customerAddresses;
    }
    
    //defines a single customer
    struct Customer{
        string name;
        string phone;
        string[] products;
        bool doesExist; // to check if customer exists as map returns default value false if does not exist
    }
    
    //defines a single retailer
    struct Retailer{
        string name;
        string location;
        bool doesExist;
    }

    //defines a single manufacturer
    struct Manufacturer{
        string name;
        string location;
        string timestamp;
        bool doesExist;
    }

    mapping (string => Product) productsMap;
    mapping (address => Customer) customersMap;
    mapping (address => Retailer) retailersMap;
    mapping (address => Manufacturer) manufacturerMap;
    
    //constructor to initialize the owner as the one who deploys the contract
    constructor(){
        owner = msg.sender;
    }

    //Function to create a new product
    //product must not exist already
    //the person trying to call must be a manufacturer
    function createProduct(string memory _productHash, string memory _brand, string memory _model, string memory _description) public manufacturerExists(msg.sender) productDoesNotExist(_productHash){
        Product memory newProduct;
        newProduct.brand = _brand;
        newProduct.model = _model;
        newProduct.status = 1;
        newProduct.description = _description;
        newProduct.manufacturerAddress = msg.sender;
        productsMap[_productHash] = newProduct;
       
    }

    //Function to create a manufacturer
    //manufacturer must not exist already
    function createManufacturer(string memory _name, string memory _location, string memory _timestamp) public manufacturerDoesNotExist(msg.sender) {    
        Manufacturer memory newManufacturer;
        newManufacturer.name = _name;
        newManufacturer.location = _location;
        newManufacturer.timestamp = _timestamp;
        newManufacturer.doesExist = true;
        manufacturerMap[msg.sender] = newManufacturer;
       
    }

    //Function to create a customer
    //customer must not exist already
    function createCustomer(string memory _name, string memory _phone) public customerDoesNotExist(msg.sender) {
        Customer memory newCustomer;
        newCustomer.name = _name;
        newCustomer.phone = _phone;
        newCustomer.doesExist = true;
        customersMap[msg.sender] = newCustomer;
        
    }

    //Function to create a retailer
    //retailer must not exist alreadt
    function createRetailer(string memory _retailerName, string memory _retailerLocation) public retailerDoesNotExist(msg.sender) {
        Retailer memory newRetailer;
        newRetailer.name = _retailerName;
        newRetailer.location = _retailerLocation;
        newRetailer.doesExist = true;
        retailersMap[msg.sender] = newRetailer;
    }
    
    //Function for adding retailer to the product will be done by the manufacturer
    //retailer should exist
    //product should exist
    //product must not be stolen
    //only manufacturer can call this
    function addRetailerToProduct(string memory _productHash, address _retailerAddress) public productNotStolen(_productHash) retailerExists(_retailerAddress) manufacturerIsCalling(_productHash){
        productsMap[_productHash].retailerAddress = _retailerAddress;
    }
    
    //Function for showing product details
    //product should exist
    //anyone can call this
    // productExists modifier here checks for the fake QR code
    // details of product shown helps the customer to identify the legit product and discard replica
    function getProductDetails(string memory _productHash) public productExists(_productHash) view returns (uint status, string memory,string memory,string memory, Manufacturer memory, Retailer memory, Customer[] memory) {
        Product memory product = productsMap[_productHash];
        Manufacturer memory manufacturer = manufacturerMap[product.manufacturerAddress];
        Retailer memory retailer = retailersMap[product.retailerAddress];
        uint length = product.customerAddresses.length;
        Customer[] memory customers = new Customer[](length);
        for(uint i = 0; i < length; i++){
            customers[i] = customersMap[product.customerAddresses[i]];
        }

        return (product.status, product.brand,product.model,product.description, manufacturer, retailer, customers);
    }

    //Function for selling the product for the first time retailer -> customer
    //customer should exist
    //product should exist
    //product must not be stolen
    //only retailer should call this method
    function transferFromRetailerToIntialOwner(string memory _productHash, address _intialOwner) productNotStolen(_productHash) customerExists(_intialOwner) retailerIsCalling(_productHash) public{
        productsMap[_productHash].customerAddresses.push(_intialOwner);
    }
    

    //Function for selling the product from owner to new owner
    //both customers should exist
    //product should exist
    //product must not be stolen
    //only the product owner should call this
    function transferOwnershipFromCustomer(string memory _productHash, address _newOwner) public customerExists(_newOwner) productNotStolen(_productHash) productOwnerIsCalling(_productHash) {
         productsMap[_productHash].customerAddresses.push(_newOwner);
    }
    
    //Function for marking the product as stolen
    //product should exist
    //only product owner can call this
    function markProductAsStolen(string memory _productHash) public productExists(_productHash) productOwnerIsCalling(_productHash) {
        productsMap[_productHash].status = 2;
    }

    // Function for checking who is the user ->new or existing and if existing then is the user
    // manufacturer, retailer or customer
    function whoIsTheUser(address _user) public view returns (string memory){
        if(customersMap[_user].doesExist){
            return "customer";
        }else if(manufacturerMap[_user].doesExist){
            return "manufacturer";
        }else if(retailersMap[_user].doesExist){
            return "retailer";
        }

        return "new";
    } 
    modifier productNotStolen(string memory _productHash){
        require(productsMap[_productHash].status == 1, "product is stolen");
        _;
    }

    modifier productExists(string memory _productHash){
        require(productsMap[_productHash].status != 0, "product doesn't exist");
        _;
    }

    modifier productDoesNotExist(string memory _productHash){
        require(productsMap[_productHash].status == 0, "product already exists");
        _;
    }

    modifier retailerExists(address _retailerAddress){
        require(retailersMap[_retailerAddress].doesExist, "retailer doesn't exist");
        _;
    }

    modifier retailerDoesNotExist(address _retailerAddress){
        require(!retailersMap[_retailerAddress].doesExist, "retailer already exists");
        _;
    }

    modifier customerExists(address _customerAddress){
        require(customersMap[_customerAddress].doesExist, "customer doesn't exist");
        _;
    }

    modifier customerDoesNotExist(address _customerAddress){
        require(!customersMap[_customerAddress].doesExist, "customer already exists");
        _;
    }

    modifier manufacturerExists(address _manufacturerAddress){
        require(manufacturerMap[_manufacturerAddress].doesExist, "manufacturer doesn't exist");
        _;
    }

    modifier manufacturerDoesNotExist(address _manufacturerAddress){
        require(!manufacturerMap[_manufacturerAddress].doesExist, "manufacturer already exists");
        _;
    }

    modifier manufacturerIsCalling(string memory _productHash){
        address  actualManufacturerAddress = productsMap[_productHash].manufacturerAddress;
        require(msg.sender == actualManufacturerAddress, "you aren't the manufacturer of this product");
        _;
    }

    modifier retailerIsCalling(string memory _productHash){
        address actualRetailerAddress = productsMap[_productHash].retailerAddress;
        require(actualRetailerAddress == msg.sender, "you aren't the retailer of this product");
        _;
    }

    modifier productOwnerIsCalling(string memory _productHash){
        Product memory product = productsMap[_productHash];
        uint numberOfCustomer = product.customerAddresses.length;
        address currentOwner;
        if(numberOfCustomer != 0){
            currentOwner = productsMap[_productHash].customerAddresses[numberOfCustomer-1];
        }
        else if(product.retailerAddress != address(0))
            currentOwner = product.retailerAddress;
        else currentOwner = product.manufacturerAddress;
        require(currentOwner == msg.sender, "you aren't the owner of this product");
        _;
    }

}

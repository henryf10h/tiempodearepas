// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventNFT is ERC1155, Ownable {
    uint256 public constant EVENT = 0;
    uint256 public eventDuration;
    uint256 public eventPrice;
    uint256 public ticketSupply;
    uint256 public counter;

    constructor(string memory uri, uint256 _eventDuration, uint256 _eventPrice, uint256 _amount) ERC1155(uri) {
        eventDuration = block.timestamp + _eventDuration;
        eventPrice = _eventPrice;
        ticketSupply = _amount;
    }

    function mintEventNFT(address account) public payable {
        require(msg.value == eventPrice, "Event NFT price must be paid");
        require(block.timestamp <= eventDuration, "Event NFT duration has passed");
        require(counter <= ticketSupply, "Can not mint more than event's supply");

        counter += 1;

        _mint(account, EVENT, 1, "");
    }

    function withdraw() public onlyOwner{

        payable(owner()).transfer(address(this).balance);
    }
}

contract MemoryNFT is ERC1155 {
    uint256 public tokenID;

    constructor(string memory uri) ERC1155(uri) {
        tokenID = 0;
    }

    function mintMemoryNFT(address account, string memory tokenURI) public {

        _mint(account, tokenID, 1, "");
        // Note: The _setURI function is not available in ERC1155, it's a function in ERC721.
        // If you want to add a specific URI to a token in ERC1155, you need to do it at the time of minting, 
        // or handle it in a different way, like mapping token IDs to URIs in your contract.
        
        tokenID++;  // Increment tokenID for the next token
    }

    // Override uri function to make sure tokenURI can be set individually
    function uri(uint256 _id) public view override returns (string memory) {
        return super.uri(_id);
    }

    // Removed _setURI function as it's causing a recursion error and it's not in the ERC1155 standard
}


contract UserFactory is Ownable {
    address public profileNFT; // Address of the user's Profile NFT contract
    address public currentEventNFT; // Address of the user's Current Event NFT contract
    bool public profileNFTCreated = false; // Flag to check if the Profile NFT contract is created

        constructor(address _owner) {
            transferOwnership(_owner);
        }

    // Function to create the Profile NFT contract
    function createProfileNFT(string memory uri) public onlyOwner {
        require(!profileNFTCreated, "Profile NFT already created"); // It should be called only once
        
        MemoryNFT memoryNFT = new MemoryNFT(uri); // here the contract is the creator of the contract

        //transferOwnership to creator
        // MemoryNFT.transferOwnership(owner());
    
        // Register the newly created Profile NFT contract
        profileNFT = address(memoryNFT);
        profileNFTCreated = true; // Set the flag to true
    }

    // Function to create the Event NFT contract
    function createEventNFT(string calldata uri, uint256 eventDuration, uint256 eventPrice, uint256 amount) public onlyOwner{
        EventNFT eventNFT = new EventNFT(uri, eventDuration, eventPrice, amount);

        // Transfer ownership of the Event NFT contract to the owner of UserFactory
        eventNFT.transferOwnership(owner());
        
        // // Start the event
        // eventNFT.startEvent();

        // Register the newly created Event NFT contract
        currentEventNFT = address(eventNFT);
    }

    // Mint function for memory NFT, can be called by anyone for free
    function mintMemory() public onlyOwner{
        require(profileNFTCreated, "Profile NFT is not created yet");
        MemoryNFT memoryNFT = MemoryNFT(profileNFT);
        memoryNFT.mintMemoryNFT(msg.sender, "");
    }

    function mintMemoryPublic(address _address) public {
        require(profileNFTCreated, "Profile NFT is not created yet");
        MemoryNFT memoryNFT = MemoryNFT(profileNFT);
        memoryNFT.mintMemoryNFT(_address, "");
    }

    // Mint function for event NFT, can be called by anyone but they have to pay
    function mintEvent() public payable {
        require(currentEventNFT != address(0), "Event NFT is not created yet");
        EventNFT eventNFT = EventNFT(currentEventNFT);
        require(msg.value == eventNFT.eventPrice(), "Not enough funds to mint event NFT");

        // Encode the function call to mintEventNFT
        bytes memory data = abi.encodeWithSignature("mintEventNFT(address)", msg.sender);

        // Forward the Ether to the EventNFT contract and call the mintEventNFT function
        (bool success,) = currentEventNFT.call{value: msg.value}(data);

        require(success, "Failed to mint NFT");
    }

    function getProfileNFT() public view returns(address){
        return profileNFT;
    }

    function getCurrentEventNFT() public view returns(address){
        return currentEventNFT;
    }

}

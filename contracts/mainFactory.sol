// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "userFactory.sol";

contract MainFactory {
    // Mapping to track user's factory contracts
    mapping(address => address) private userFactories;

    // Function to create a new User Factory Contract
    function createUserFactory() public {
        // Check if user already has a factory contract
        require(userFactories[msg.sender] == address(0), "User already has a factory contract");

        // Create new User Factory Contract
        UserFactory newUserFactory = new UserFactory(msg.sender);
        
        // Register the newly created User Factory Contract
        userFactories[msg.sender] = address(newUserFactory);
    }

    function factories(address _address) public view returns(address){
        return(userFactories[_address]);
    }
}
// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ReputationTest is ERC20 {
    constructor() ERC20("Test Reputation Score", "TRSC") {
        _mint(msg.sender, 1000000000000000000000000000000);
    }
}
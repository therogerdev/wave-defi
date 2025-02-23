// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Roger Token
 * @dev Very simple roger token that is used for demonstrating various of DeFi applications
 */

contract RogerToken is ERC20 {
    constructor() ERC20("Roger Token", "RGR") {
        // Initial supply of 1,000,000,000 tokens are given to msg.sender
        _mint(msg.sender, 1e27);
    }
}

/**
 * @title StableCoin
 * @dev An ERC20 token contract representing a stablecoin.
 * The contract mints an initial supply of 1e27 tokens to the contract deployer.
 */

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";



contract StableCoin is ERC20 {
    constructor() ERC20("StableCoin", "STC") {
        _mint(msg.sender, 1e27);
    }
}


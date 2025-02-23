// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AquaSwap
 * @dev An ERC20 token contract that inherits from OpenZeppelin's ERC20 and Ownable contracts.
 * The contract allows the owner to mint new tokens and users to burn their own tokens.
 */
contract AquaSwap is ERC20, Ownable {
    constructor() ERC20("AquaSwap", "AQSWP") Ownable(msg.sender) {
        _mint(msg.sender, 1e24); // 1 million tokens
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance to burn");
        _burn(msg.sender, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}
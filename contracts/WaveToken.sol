// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WaveToken
 * @dev An ERC20 token contract that is owned by a single address.
 * The contract allows the owner to mint new tokens and users to burn their own tokens.
 */
contract WaveToken is ERC20, Ownable {
    constructor() ERC20("Wave Token", "WAVE") Ownable(msg.sender) {
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
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "redstone-evm-connector/lib/contracts/message-based/PriceAware.sol";

interface SDOT {
    function fundRaisedBalance() external view returns (uint256);

    function totalSupply() external view returns (uint256);

    function getTotalShares() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);
}

interface WSDOT {
    function totalSupply() external view returns (uint256);
}

contract LidoPeripheral is PriceAware {
    address public stDOTContract;
    address public wstDOTContract;
    address public owner;

    constructor (
        address _stDOTContract,
        address _wstDOTContract
    ) {
        stDOTContract = _stDOTContract;
        wstDOTContract = _wstDOTContract;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function isSignerAuthorized(address _receviedSigner) public override virtual view returns (bool) {
        return _receviedSigner == 0x0C39486f770B26F5527BBBf942726537986Cd7eb; // redstone-main
    }

    function _changeOwner(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    function _changeStDOTContract(address newStDOTContract) external onlyOwner {
        stDOTContract = newStDOTContract;
    }

    function _changeWstDOTContract(address newWstDOTContract) external onlyOwner {
        wstDOTContract = newWstDOTContract;
    }

    function getDOTPriceInUSD() public view returns (uint256) {
        return getPriceFromMsg(bytes32("DOT"));
    }

    function stDOTPrice() public view returns (uint256) {
        uint256 dotPriceInUSD = getDOTPriceInUSD();
        uint256 stDOTvalue = (dotPriceInUSD *
            xcDOTTotalSupplyOnLido()) / stDOTTotalSupply();
        return stDOTvalue;
    }

    function wstDOTPrice() external view returns (uint256) {
        return (xcDOTTotalSupplyOnLido() * stDOTPrice()) / stDOTTotalShares();
    }

    function stDOTTotalSupply() public view returns (uint256) {
        return SDOT(stDOTContract).totalSupply();
    }

    function stDOTTotalShares() public view returns (uint256) {
        return SDOT(stDOTContract).getTotalShares();
    }

    function xcDOTTotalSupplyOnLido() public view returns (uint256) {
        return SDOT(stDOTContract).fundRaisedBalance();
    }
}
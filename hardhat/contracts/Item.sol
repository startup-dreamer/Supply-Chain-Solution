pragma solidity ^0.8.0;

import "./ItemManager.sol";

contract item {
    uint public PriceinWei;
    uint public ItemIndex;
    uint public Pricepaid;

    ItemManager parentContract;

    constructor(ItemManager _parentContract, uint _PriceinWei, uint _ItemIndex) {
        parentContract = _parentContract;
        PriceinWei = _PriceinWei;
        ItemIndex = _ItemIndex;
    }

    receive() external payable {
        require(Pricepaid == 0,"already paid item is further in supply chain");
        require(PriceinWei == msg.value, "Only full payment is allowed");
        (bool success, ) = address(parentContract).call{value : msg.value}(abi.encodeWithSignature("triggerPayment(uint256)", ItemIndex));
        Pricepaid  = msg.value;
        require(success, "Transection is failed, cancelling");
    }
        fallback () external {

        }
} 
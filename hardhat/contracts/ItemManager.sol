pragma solidity ^0.8.0;

import "./Item.sol";


contract ItemManager {
    
    modifier Owner_or_Allowed(uint _index) {
        require(msg.sender == Owner || items[_index]._itemPrice > 0, "You are not authorised");
        _;
    }

    enum SupplyChainstate{None, Created, Paid, Delivered}

    uint public ItemIndex;

    address public Owner;
    

    struct Structure_items {
        item _item;
        uint _itemPrice;
        string _identifier;
        ItemManager.SupplyChainstate _state;
    }
    mapping(uint => Structure_items) public items;


    event SupplyChainstateTriggers(uint indexed _index, uint indexed _step, address indexed _itemAddress);

    constructor() public {
        Owner = msg.sender;
    }

    function CraetItem(string memory _identifier, uint _price) public{
        item Item = new item(this, _price, ItemIndex);
        items[ItemIndex]._item = Item;
        items[ItemIndex]._identifier = _identifier;
        items[ItemIndex]._itemPrice = _price;
        items[ItemIndex]._state = SupplyChainstate.Created;
        emit SupplyChainstateTriggers(ItemIndex, uint(SupplyChainstate.Created), address(Item));
        ItemIndex++;

    }

    function TriggerPayement(uint _index) public  Owner_or_Allowed(_index) payable {
        require(items[_index]._state == SupplyChainstate.Created, "Item is further in Supplychain");
        require(items[_index]._itemPrice == msg.value,"Only full payament is allowed");
        items[_index]._state = SupplyChainstate.Paid;
        emit SupplyChainstateTriggers(_index, uint(SupplyChainstate.Paid), address(items[_index]._item));

    }

    function TriggerDelivery(uint _index) public Owner_or_Allowed(_index) {
        require(items[_index]._state == SupplyChainstate.Paid, "Item is not Paid yet");
        items[_index]._state = SupplyChainstate.Delivered;
        emit SupplyChainstateTriggers(_index, uint(SupplyChainstate.Delivered), address(items[_index]._item));
    }

    function SendMoney_to_Owner() payable public {
        (bool success,) = Owner.call{value: address(this).balance}("");
        require(success,"something went wrong funds not transfered");
    }
}


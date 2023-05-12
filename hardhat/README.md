### SupplyChainManagement Smart Contract Documentation

The SupplyChainManagement smart contract is used for managing the supply chain of items. It contains the following features:

#### Imports
This contract imports another contract called Item.sol

#### Modifiers
- Owner_or_Allowed: This modifier is executed before a function is called in this contract. It checks if the caller trying to access a specific index of the item array is either the owner of the contract or if the item has already been created.

#### Enums
- SupplyChainState: This enum defines the possible states that an item can go through in the supply chain. The states are: 
    - Created
    - Paid
    - Delivered

#### Variables
- owner: Address of the owner of the smart contract.
- ItemIndex: A tracking variable used to keep track of the number of items.

#### Structs
- Structure_items: This struct keeps track of an item's state, price, identifier, and address of the item.

#### Mappings
- items: This mapping is used to store all items created in the supply chain.

#### Events
- SupplyChainstateTriggers: This event is triggered whenever an item changes its state.

#### Functions
- createItem(): This function creates a new item for the supply chain and initializes its state. It also stores it in the items mapping.
- triggerPayment(): This function triggers the payment for an item and changes its state from created to paid.
- triggerDelivery(): This function triggers the delivery of an item and changes its state from paid to delivered.

**ItemManager seploia address** ```0x18648e6138868249973b80061b1da6A931938ECa```
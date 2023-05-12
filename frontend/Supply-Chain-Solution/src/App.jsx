import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ItemManagerContract from '../contracts/ItemManager.sol/ItemManager.json';
// import {CONTRACT_ADDRESS} from '../contracts/ItemManager.sol/index';

import './App.css';
const CONTRACT_ADDRESS = "0x458D96DB5Bf97c7D1917dD0DeD9d2FE418772f13"


function App() {
  const [connected, setConnected] = useState(false);
  const [provider, setProvider] = useState(null); // state variables for provider and contract instance
  const [contract, setContract] = useState(null);
  const [items, setItems] = useState([]); // state variable for items array
  
  const connectWallet = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      await window.ethereum.request({
        method: "eth_chainId",
      });
      const instance = new ethers.Contract(
        CONTRACT_ADDRESS,
        ItemManagerContract.abi,
        provider.getSigner(),
      );
      setProvider(provider); // update provider and contract instance
      setContract(instance);
      setConnected(true); // update connected to true
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    
    connectWallet();
  }, [connected]);


const createItem = async (identifier, price) => { // function to create an item
  const address = await provider.getSigner().getAddress();
  console.log(address)
  await contract.CraetItem(identifier, ethers.utils.parseEther(price));
};

const triggerPayment = async (index = 0) => { // function to trigger payment for an item
  const from = await provider.getSigner().getAddress();
  const item = await contract.items(index);
  await contract.TriggerPayement(index, { from, value: item._itemPrice, gasLimit: 50000 });
};

const triggerDelivery = async (index = 0) => { // function to trigger delivery for an item
  const from = await provider.getSigner().getAddress();
  await contract.TriggerDelivery(index, { from });
};



  const getItems = async () => { // function to retrieve all items
    const itemsCount = await contract.ItemIndex();
    const newItems = [];
    for (let i = 0; i < itemsCount.toNumber(); i++) {
      const item = await contract.items(i);
      newItems.push(item);
    }
    setItems(newItems);
  };

const bignumber_to_eth = (ethAmountInWei) => {
  return ethers.utils.formatEther(ethAmountInWei);
}

const product_state = (state) => {
    if(state==1){
      return "Created Not Payed"
    }
    if(state==2){
      return "Payed"
    }
    else {
      return "Delivered"
    }
}

  useEffect(() => { // call getItems once provider and contract instance are initialized
    if (provider && contract) {getItems();  console.log(items);};
  }, [provider, contract]);


  return (<div className="container">
    <nav className="navbar">
      <h1 className="navbar-heading">Supply Chain Solution</h1>
      {connected ? (
        <button className="connected-wallet-btn">Connected</button>
      ) : (
        <button className="connect-wallet-btn" onClick={connectWallet}>Connect Wallet</button>
      )}
    </nav>
     <div>
  <label>Item Identifier: </label>
  <input type="text" id="identifier" />
  <label>Cost: </label>
  <input type="number" id="cost" />
  <button onClick={() => createItem(document.getElementById("identifier").value, document.getElementById("cost").value)}>Create Item</button>
</div>

<div>
  <label>Item Index: </label>
  <input type="number" id="index" />
  <button onClick={() => triggerPayment(items.length - document.getElementById("index").value)}>Trigger Payment</button>
</div>
<div>
  <label>Item Index: </label>
  <input type="number" id="index" />
  <button onClick={() => triggerDelivery(document.getElementById("index").value)}>Trigger Delivery</button>
</div>

      <div>
      {items.length > 0 ? (
  <table>
  <thead>
    <tr>
      <th>Index</th>
      <th>Item Contract Address</th>
      <th>Product Name</th>
      <th>Price</th>
      <th>State of Product</th>
    </tr>
  </thead>
  <tbody>
    {items.slice().reverse().map((item, index) => (
      <tr key={index}>
        <td>{index}</td>
        <td>{item._item}</td>
        <td>{item._identifier}</td>
        <td>{bignumber_to_eth(item._itemPrice._hex)} Eth</td>
        <td>{product_state(item._state)}</td>
      </tr>
    ))}
  </tbody>
</table>

) : (
  <p>No items found</p>
)}
  </div>
  </div>
    
  );
}

export default App;

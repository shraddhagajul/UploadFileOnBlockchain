import React, { Component } from "react";
import ipfs from "./ipfs"
import "./App.css";
import Web3 from "web3";
import Meme from './abis/Meme.json'

class App extends Component {

  constructor(props){
    super(props);
    this.state = { 
      buffer : null,
      url : null,
      account: '',
      contract: null,
      memeHash: ''
      
     };

  }
 

   async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData()
  }

  async loadWeb3() {

    // // Get network provider and web3 instance.
    // this.web3 = await getWeb3();
    // let connected = await this.web3.eth.net.isListening();
    // if (connected) {
    //     this.setState({isConnected: true})
    // }

    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)

    }else{
      window.alert('Please use metamask')
    }
}

async loadBlockchainData() {

  // load blockchain data
  const web3  = window.web3;
  const accounts = await web3.eth.getAccounts();
  this.setState({ account: accounts[0]});

  const networkId = await web3.eth.net.getId();
  const networkData = Meme.networks[networkId];
  if(networkData){
      // const abi = Meme.abi;
      // const address = networkData.address;
      // const contract = new web3.eth.Contract(abi, address);
      const contract = new web3.eth.Contract(Meme.abi, networkData.address)
      this.setState({contract : contract})
      const memeHash = await contract.methods.getMemeHash().call()
      this.setState({memeHash})

  }else{
      window.alert('Smart Contract not deployed to detected network');
  }
}
  captureFile = (event) => {
    event.preventDefault()
    console.log("File capture");
    //process file for ipfs
    //fetch file from event
    console.log(event.target.files);
    const file = event.target.files[0];
    //FileReader -> reads contents of files stored on user's computer asynchronously
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      console.log('buffer',Buffer(reader.result))
      this.setState({buffer : Buffer(reader.result)})
    }

  }
// hash: "QmYEybpmBxjHLDjpQNbygvghGYU3e48PavHe5qP1RoxpH3"
// url : https://ipfs.infura.io/ipfs/QmYEybpmBxjHLDjpQNbygvghGYU3e48PavHe5qP1RoxpH3
   onSubmit = async(event) => {
    event.preventDefault()
    console.log("Submitting");
    await ipfs.add(this.state.buffer,async (error,result) => {
      console.log(error,result);
     const memeHash = result[0].hash;

      this.setState({
        memeHash : result[0].hash
      })
      //Call smart contract 
    await this.state.contract.methods.setMemeHash(memeHash).send({
      from : this.state.account, to : this.state.contract
    }).then((r) => {
      return this.setState({
        memeHash 
      })
    })
    })
    
  }

   render() {
   
    return (
      <div className="App">
         <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="www.google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
      <h1>Meme of the day!</h1>
      </a>
      </nav>
      <h2>Change meme</h2>
      <img src={`https://ipfs.infura.io/ipfs/${this.state.memeHash}`}></img>
      <form onSubmit={this.onSubmit}>

      <input type='file' onChange={this.captureFile}></input>
      <input type='submit'></input>
      </form>
      

      
    </div>
    );
  }
}

export default App;

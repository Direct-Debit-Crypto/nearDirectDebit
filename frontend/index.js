// React
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from "react-router-dom";

//DIRECT DEBIT 
const DIRECT_DEBIT_CONTRACT_ADDRESS = 'dev-1668970976367-68686872023814'
// dev-1668949015166-17884274375278


// NEAR
import { Wallet } from './near-wallet';

// When creating the wallet you can optionally ask to create an access key
// Having the key enables to call non-payable methods without interrupting the user to sign
const wallet = new Wallet({ createAccessKeyFor: DIRECT_DEBIT_CONTRACT_ADDRESS })

// Setup on page load
window.onload = async () => {
  const isSignedIn = await wallet.startUp()
 
  ReactDOM.render(
    <React.StrictMode>
     <BrowserRouter>
        <App isSignedIn={isSignedIn} contractId={DIRECT_DEBIT_CONTRACT_ADDRESS} wallet={wallet} />
    </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
  );
}
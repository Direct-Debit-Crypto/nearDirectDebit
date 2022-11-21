
import React from 'react';
import { utils } from 'near-api-js'
import Layout from './Layout';

// Call this only if Sign IN
export function DirectDebit({contractIdIn, walletIn}) {

    const[loaded, setLoaded] = React.useState(false);
    const[maxVendorsNumberContract, setMaxVendorsNumberContract] = React.useState(0);
    const[payLater, setPayLater] = React.useState(false);
    const[owner, setOwner] = React.useState(false);
    const[treasure, setTreasure] = React.useState(BigInt(0));
    const[vendorsAmountUsed, setVendorsAmountUsed] = React.useState(BigInt(0));
    const[vendorMaxAmount, setVendorMaxAmount] = React.useState(BigInt(0));

  // Get blockchian state once on component load
  React.useEffect(() => {
    getMaxNumberVendor()
      .then(setMaxVendorsNumberContract)
      .catch(alert)
      .finally(() => {
        setLoaded(true);
      });
    getPayLater()
      .then(setPayLater)
      .catch(alert)
      .finally(() => {
        setLoaded(true);
      });
    getOwner()
      .then(setOwner)
      .catch(alert)
      .finally(() => {
        setLoaded(true);
      });
    getTreasure()
      .then(setTreasure)
      .catch(alert)
      .finally(() => {
        setLoaded(true);
      });
    getVendorsAmountUsed()
      .then(setVendorsAmountUsed)
      .catch(alert)
      .finally(() => {
        setLoaded(true);
      });
    getVendorMaxAmount()
      .then(setVendorMaxAmount)
      .catch(alert)
      .finally(() => {
        setLoaded(true);
      });
    
    }
  , []);

  function getMaxNumberVendor(){
    // use the wallet to query the contract's greeting
    console.log(contractIdIn)
    return walletIn.viewMethod({ contractId: contractIdIn, method: 'get_maxNumberVendor' })
  }

  function getPayLater(){
    // use the wallet to query the contract's greeting
    return walletIn.viewMethod({ contractId: contractIdIn, method: 'get_payLater' })
  }

  function getOwner(){
    // use the wallet to query the contract's greeting
    return walletIn.viewMethod({ contractId: contractIdIn, method: 'get_owner' })
  }

  function getTreasure(){
    // use the wallet to query the contract's greeting
    return walletIn.viewMethod({ contractId: contractIdIn, method: 'get_treasure' })
  }

  function getVendorsAmountUsed(){
    // use the wallet to query the contract's greeting
    return walletIn.viewMethod({ contractId: contractIdIn, method: 'get_vendors_amount_used'})
  }

  function getVendorAmountUsed({vendorAddressIn}){
    // use the wallet to query the contract's greeting
    return walletIn.viewMethod({ contractId: contractIdIn, method: 'get_vendor_amount_used', args: {"vendorAddress" : vendorAddressIn}})
  }

  function getVendorMaxAmount(){
    // use the wallet to query the contract's greeting
    return walletIn.viewMethod({ contractId: contractIdIn, method: 'get_vendor_max_amount' })
  }

  function addBudgetDirectDebit(e)
  {
    console.log('addBudgetDirectDebit called');
    e.preventDefault();
    
    var vendorAddress = document.getElementById('vendorAddress').value;
    var amountInput = document.getElementById('amountInput').value;
    console.log('vendor address ' + vendorAddress + ' amountInput: ' + amountInput)
        
    // use the wallet to send the greeting to the contract
    walletIn.callMethod({ method: 'deposit_treasure', contractId: contractIdIn, deposit: utils.format.parseNearAmount(amountInput) })
      .then(async () => {return getTreasure();})
      .then(setTreasure)
      .finally(() => {
        setUiPleaseWait(false);
      });
    
  }

  // Function call to blockchain
  function withdrawDirectDebit(e)
  {
    console.log('withdrawDirectDebit called');
    e.preventDefault();
    
    var vendorAddress = document.getElementById('vendorAddress').value;
    var amountInput = document.getElementById('amountInput').value;

    console.log('vendor address ' + vendorAddress + ' amountInput: ' + amountInput)
        
    // use the wallet to send the greeting to the contract
    walletIn.callMethod({ method: 'withdraw_treasure', args: { amount:  utils.format.parseNearAmount(amountInput) }, contractId: contractIdIn })
      .then(async () => {return getTreasure();})
      .then(setTreasure)
      .finally(() => {
        setUiPleaseWait(false);
      });
    
  }

  // Function call to blockchain
  function addVendorDirectDebit(e)
  {
    console.log('addVendorDirectDebit called');
    e.preventDefault();
    
    var vendorAddress = document.getElementById('vendorAddress').value;
    var amountInput = document.getElementById('amountInput').value;
    console.log('vendor address ' + vendorAddress + ' amountInput: ' + amountInput)
        
    // use the wallet to send the greeting to the contract
    walletIn.callMethod({ method: 'add_vendor', args: { vendorAddress: vendorAddress, limitAmount:  utils.format.parseNearAmount(amountInput) }, contractId: contractIdIn })
      .then(async () => {return getGreeting();})
      .then(setValueFromBlockchain)
      .finally(() => {
        setUiPleaseWait(false);
      });
    
  }

  // Function call to blockchain
  function removeVendorDirectDebit(e)
  {
    console.log('removeVendorDirectDebit called');
    e.preventDefault();
    
    var vendorAddress = document.getElementById('vendorAddress').value;
    var amountInput = document.getElementById('amountInput').value;
    console.log('vendor address ' + vendorAddress + ' amountInput: ' + amountInput)
        
    // use the wallet to send the greeting to the contract
    walletIn.callMethod({ method: 'remove_vendor', args: { vendorAddress: vendorAddress }, contractId: contractIdIn })
      .then(async () => {return getGreeting();})
      .then(setValueFromBlockchain)
      .finally(() => {
        setUiPleaseWait(false);
      });
    
  }

  // Function call to blockchain
  function payVendorDirectDebit(e)
  {
    console.log('payVendorDirectDebit called');
    e.preventDefault();
    
    var vendorAddress = document.getElementById('vendorAddress').value;
    var amountInput = document.getElementById('amountInput').value;
    console.log('vendor address ' + vendorAddress + ' amountInput: ' + amountInput)
        
    // use the wallet to send the greeting to the contract
    walletIn.callMethod({ method: 'pay_vendor', args: { vendorAddress: vendorAddress }, contractId: contractIdIn })
      .then(async () => {return getGreeting();})
      .then(setValueFromBlockchain)
      .finally(() => {
        setUiPleaseWait(false);
      });
    
  }

  // Function call to blockchain
  function payAllVendorsDirectDebit(e)
  {
    console.log('payAllVendorsDirectDebit called');
    e.preventDefault();
    
    var vendorAddress = document.getElementById('vendorAddress').value;
    var amountInput = document.getElementById('amountInput').value;
    console.log('vendor address ' + vendorAddress + ' amountInput: ' + amountInput)
        
    // use the wallet to send the greeting to the contract
    walletIn.callMethod({ method: 'pay_all_vendors', contractId: contractIdIn })
      .then(async () => {return getGreeting();})
      .then(setValueFromBlockchain)
      .finally(() => {
        setUiPleaseWait(false);
      });
    
  }



    return (
    <Layout wallet={walletIn}>
        {loaded==false?
        <>
            <h1>Loading...</h1>
        </>
        :
        <>
            <p>Direct Debit: {contractIdIn} </p>
            <p>Maximum vendors: {maxVendorsNumberContract} </p>
            <p>Pay {payLater == true? "Later":"At Invoice"} </p>
            <p>Owner: {owner} </p>
            <p>Budget: {utils.format.formatNearAmount(treasure)} NEAR</p>
            <p>Outstanding Amount: {utils.format.formatNearAmount(vendorsAmountUsed)} NEAR </p>
            <p>Maximum outstanding amount possible: {utils.format.formatNearAmount(vendorMaxAmount)} NEAR </p>
            
            <form className="changeDirectDebit">
              <div>
                <div className="inputDirectDebit">
                  <span>Address: </span>
                  <input
                    autoComplete="off"
                    id="vendorAddress"
                    type="string"
                  />
                </div>
                <div className="inputDirectDebit">
                  <span>Amount: </span>
                  <input
                    autoComplete="off"
                    id="amountInput"
                    type="number"
                  />
                </div>
                <button className="loaderDirectDebit" onClick={addBudgetDirectDebit}>
                    <span>Add budget</span>
                  </button>
                <button className="loaderDirectDebit" onClick={withdrawDirectDebit}>
                    <span>Withdraw</span>
                  </button>
                <button className="loaderDirectDebit" onClick={addVendorDirectDebit}>
                    <span>Add vendor</span>
                  </button>
                <button className="loaderDirectDebit" onClick={removeVendorDirectDebit}>
                    <span>Remove Vendor</span>
                  </button>
                <button className="loaderDirectDebit" onClick={payVendorDirectDebit}>
                    <span>Pay vendor</span>
                  </button>
                <button className="loaderDirectDebit" onClick={payAllVendorsDirectDebit}>
                    <span>Pay all</span>
                </button>
              </div>
            </form>
        </>
        }
    </Layout>
    );
  }
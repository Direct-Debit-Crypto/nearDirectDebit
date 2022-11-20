
import React from 'react';

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
      .then(setMaxVendorsNumberContract)
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

    return (
    <>
        {loaded==false?
        <>
            <h1>Loading...</h1>
        </>
        :
        <>
            <p>Contract address: {contractIdIn} </p>
            <p>Pay Later feature: {payLater == true? "Enabled":"Disabled"} </p>
            <p>Owner: {owner} </p>
            <p>Budget: {treasure} </p>
            <p>Outstanding Amount: {vendorsAmountUsed} </p>
            <p>Maximum outstanding amount possible: {vendorMaxAmount} </p>
        </>
        }
      {/* <button style={{ float: 'right' }} onClick={onClick}>
        Sign out {accountId}
      </button>
      <button style={{ float: 'right' }} onClick={onClick}>
        Sign out {accountId}
      </button>
      <button style={{ float: 'right' }} onClick={onClick}>
        Sign out {accountId}
      </button> */}
    </>
    );
  }
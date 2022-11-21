
import React from 'react';
import { DirectDebit } from './DirectDebit';
import Layout from './Layout';


export function AllDirectDebit({contractIdIn, walletIn}) {

    const[directDebitAddress, setDirectDebitAddress] = React.useState("");

    function setDirectDebitContractAddress(e)
    {
      console.log('setDirectDebitContractAddress called');
      e.preventDefault();
      
      var contractDirectDebit = document.getElementById('contractDirectDebit').value;
      console.log('contract address ' + contractDirectDebit);
          
      // use the wallet to get the contract
      setDirectDebitAddress(contractDirectDebit);
      
    }
  

    //Add feature
    return (
    <Layout wallet={walletIn}>
        <div className='alldirectdebit'>
        <form className="changeDirectDebit">
            <div className="inputAllDirectDebit">
                <span>Address: </span>
                <input
                autoComplete="off"
                id="contractDirectDebit"
                type="string"
                />
            </div>
            
            <button className="loaderAllDirectDebit" onClick={setDirectDebitContractAddress}>
                <span>Query Direct Debit</span>
            </button>

            {directDebitAddress === "" ?
                <h3>Query a Direct Debit Contract...</h3>
                :
                <DirectDebit walletIn={walletIn} contractIdIn={directDebitAddress}/>
            }
        </form>
        </div>
    </Layout>
    );
  }
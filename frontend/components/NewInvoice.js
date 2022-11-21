
import React from 'react';
import { utils } from 'near-api-js'
import Layout from './Layout';


export function NewInvoice({contractIdIn, walletIn}) {


    const[emited, setEmited] = React.useState(false);
    const[contractAddress, setContractAddress] = React.useState("!!!NO ADDRESS SET!!!");

  // Function call to blockchain
  function emitNewInvoice(e)
  {
    console.log('payAllVendorsDirectDebit called');
    e.preventDefault();
    
    var contractDirectDebit = document.getElementById('contractDirectDebit').value;
    var amountInput = document.getElementById('amountInvoice').value;
    setContractAddress(contractDirectDebit);

    console.log('direct debit address ' + contractDirectDebit + ' amountInput: ' + amountInput)
        
    // use the wallet to send the greeting to the contract
    walletIn.callMethod({ method: 'set_invoice', args: { amount_in: utils.format.parseNearAmount(amountInput) },  contractId: contractDirectDebit })
      .then(async () => {return getGreeting();})
      .then(setValueFromBlockchain)
      .finally(() => {
        setEmited(true);
      });
    
  }

    //RETURN
    return (
        <Layout wallet={walletIn}>
            <div className='newInvoice'>
            <form className="newInvoiceQuery">
                <div className="inputNewInvoice">
                    <span>Address: </span>
                    <input
                    autoComplete="off"
                    id="contractDirectDebit"
                    type="string"
                    />
                </div>
                <div className="inputNewInvoice">
                    <span>Amount: </span>
                    <input
                    autoComplete="off"
                    id="amountInvoice"
                    type="number"
                    />
                </div>
                
                <button className="loaderNewInvoice" onClick={emitNewInvoice}>
                    <span>Emit Invoice</span>
                </button>
                {emited == false ?
                    <></>
                    :
                    <p>New invoice has been emitted for {contractAddress}</p>    

                }
            </form>
            </div>
        </Layout>
    );
  }
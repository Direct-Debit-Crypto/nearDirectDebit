import 'regenerator-runtime/runtime';
import React from 'react';

import * as nearlib from "near-api-js";

import '../assets/global.css';

import { EducationalText, SignInPrompt, SignOutButton } from '../ui-components';
import { async } from 'regenerator-runtime';
import { DirectDebit } from './DirectDebit';
import Layout from './Layout';


export default function NewDirectDebit({ contractIdIn, walletIn }) {
  const [valueFromBlockchain, setValueFromBlockchain] = React.useState();

  const [uiPleaseWait, setUiPleaseWait] = React.useState(false);

  // Get blockchian state once on component load
  // React.useEffect(() => {
  //   getGreeting()
  //     .then(setValueFromBlockchain)
  //     .catch(alert)
  //     .finally(() => {
  //       setUiPleaseWait(false);
  //     });
  //   }
  // , []);



  async function deployDirectDebit() {
    console.log("Deploying....");

    console.log(wallet.accountId);
    const account = await new nearlib.Account(wallet.accountId);
    console.log(account);
    // let state = await account.state();
    // console.log(state);
    
    console.log("Downloading started...");
    let data = await fetch('/direct_debit.wasm');
    console.log(data);
    let buf = await data.arrayBuffer();
    console.log(buf);
    console.log("Downloading done. Deploying contract...");

    const accountbalance =  await account.getAccountBalance();
    console.log(accountbalance);

    // const contract =  await account.deployContract(new Uint8Array(buf));
    // console.log(contract);
    

    // if (state.code_hash !== 'F6iocDrCDzBCxUN9PKPeVp7GqDuPve4g3ypHQQrmEw5E') {
    //   this.log("Going to deploy the code");
    //   // no code. Need to deploy.
    //   this.log("Downloading started...");
    //   let data = await fetch('/metanear_user.wasm');
    //   let buf = await data.arrayBuffer();
    //   this.log("Downloading done. Deploying contract...");
    //   await account.deployContract(new Uint8Array(buf));
    //   if (state.code_hash === '11111111111111111111111111111111') {
    //     this.log("Deploying done. Initializing contract...");
    //     // Gotta init it.
    //     let contract = await new nearlib.Contract(account, accountId, {
    //       viewMethods: [],
    //       // Change methods can modify the state. But you don't receive the returned value when called.
    //       changeMethods: ['new'],
    //       // Sender is the account ID to initialize transactions.
    //       sender: accountId
    //     });
    //     console.log(await contract.new());
    //   }
    //   this.log("The contract is deployed");
    // }

    // const masterContract = await new nearlib.Contract(account, accountId, {
    //   // View methods are read only. They don't modify the state, but usually return some value.
    //   viewMethods: ['apps'],
    //   // Change methods can modify the state. But you don't receive the returned value when called.
    //   changeMethods: ['add_app_key', 'remove_app_key'],
    //   // Sender is the account ID to initialize transactions.
    //   sender: accountId
    // });

    // this.masterContract = masterContract;
    // window.masterContract = masterContract;
    // this.log("Fetching authorized apps...");
    // console.log("Apps:", await masterContract.apps());

    // this.log("Initializing local apps...");
    // const apps = {
    //   profile: await this.initMetaNearApp('profile', accountId),
    //   chat: await this.initMetaNearApp('chat', accountId),
    //   mail: await this.initMetaNearApp('mail', accountId),
    //   // keys: await this.initMetaNearApp('keys', accountId)
    // };
    // window.apps = apps;
    // this.apps = apps;
    // this.setState({
    //   apps,
    //   loading: false,
    // })
  }


  return (
    <Layout wallet={walletIn}>
      <main className={uiPleaseWait ? 'please-wait' : ''}>
        <h2>
          Direct Debit Interface In Progress..
        </h2>
          <button onClick={deployDirectDebit}>
            <span>Deploy Direct Debit</span>
            <div className="loader"></div>
          </button>
        {/* <DirectDebit contractIdIn={contractIdIn} walletIn={walletIn} /> */}
      </main>
    </Layout>
  );
}
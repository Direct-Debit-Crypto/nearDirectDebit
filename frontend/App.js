import 'regenerator-runtime/runtime';
import React from 'react';

import './assets/global.css';

import { EducationalText, SignInPrompt, SignOutButton } from './ui-components';
import { async } from 'regenerator-runtime';
import { DirectDebit } from './components/DirectDebit';


export default function App({ isSignedIn, contractId, wallet }) {
  const [valueFromBlockchain, setValueFromBlockchain] = React.useState();

  const [uiPleaseWait, setUiPleaseWait] = React.useState(true);

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

  /// If user not signed-in with wallet - show prompt
  if (!isSignedIn) {
    // Sign-in flow will reload the page later
    return <SignInPrompt greeting={valueFromBlockchain} onClick={() => wallet.signIn()}/>;
  }

  // function changeGreeting(e) {
  //   e.preventDefault();
  //   setUiPleaseWait(true);
  //   const { greetingInput } = e.target.elements;
    
  //   // use the wallet to send the greeting to the contract
  //   wallet.callMethod({ method: 'set_greeting', args: { message: greetingInput.value }, contractId })
  //     .then(async () => {return getGreeting();})
  //     .then(setValueFromBlockchain)
  //     .finally(() => {
  //       setUiPleaseWait(false);
  //     });
  // }

  // async function deployDirectDebit() {
  //   const accountId = authData.accountId || await this.props.wallet.getAccountId();
  //   this.setState({
  //     login: true,
  //     loading: true,
  //     accountId,
  //   })
  //   if (window.location.search.includes("account_id")) {
  //     window.location.replace(window.location.origin + window.location.pathname)
  //   }
  //   if (window.location.search.includes("all_keys")) {
  //     window.location.replace(window.location.origin + window.location.pathname)
  //   }
  //   // Initializing our contract APIs by contract name and configuration.

  //   this.log("Connecting to account...");
  //   const account = await new nearlib.Account(window.near.connection, accountId);
  //   this.log("Querying state...");
  //   let state = await account.state();
  //   /*
  //   await new Promise((resolve, reject) =>{
  //     setTimeout(() => {
  //       resolve();
  //     }, 5000);
  //   })
  //    */
  //   console.log(state);
  //   if (state.code_hash !== 'F6iocDrCDzBCxUN9PKPeVp7GqDuPve4g3ypHQQrmEw5E') {
  //     this.log("Going to deploy the code");
  //     // no code. Need to deploy.
  //     this.log("Downloading started...");
  //     let data = await fetch('/metanear_user.wasm');
  //     let buf = await data.arrayBuffer();
  //     this.log("Downloading done. Deploying contract...");
  //     await account.deployContract(new Uint8Array(buf));
  //     if (state.code_hash === '11111111111111111111111111111111') {
  //       this.log("Deploying done. Initializing contract...");
  //       // Gotta init it.
  //       let contract = await new nearlib.Contract(account, accountId, {
  //         viewMethods: [],
  //         // Change methods can modify the state. But you don't receive the returned value when called.
  //         changeMethods: ['new'],
  //         // Sender is the account ID to initialize transactions.
  //         sender: accountId
  //       });
  //       console.log(await contract.new());
  //     }
  //     this.log("The contract is deployed");
  //   }

  //   const masterContract = await new nearlib.Contract(account, accountId, {
  //     // View methods are read only. They don't modify the state, but usually return some value.
  //     viewMethods: ['apps'],
  //     // Change methods can modify the state. But you don't receive the returned value when called.
  //     changeMethods: ['add_app_key', 'remove_app_key'],
  //     // Sender is the account ID to initialize transactions.
  //     sender: accountId
  //   });

  //   this.masterContract = masterContract;
  //   window.masterContract = masterContract;
  //   this.log("Fetching authorized apps...");
  //   console.log("Apps:", await masterContract.apps());

  //   this.log("Initializing local apps...");
  //   const apps = {
  //     profile: await this.initMetaNearApp('profile', accountId),
  //     chat: await this.initMetaNearApp('chat', accountId),
  //     mail: await this.initMetaNearApp('mail', accountId),
  //     // keys: await this.initMetaNearApp('keys', accountId)
  //   };
  //   window.apps = apps;
  //   this.apps = apps;
  //   this.setState({
  //     apps,
  //     loading: false,
  //   })
  // }


  // function getGreeting(){
  //   // use the wallet to query the contract's greeting
  //   return wallet.viewMethod({ method: 'get_greeting', contractId })
  // }

  console.log(contractId)

  return (
    <>
      <SignOutButton accountId={wallet.accountId} onClick={() => wallet.signOut()}/>
      <main className={uiPleaseWait ? 'please-wait' : ''}>
        {/* <h1>
          The contract says: <span className="greeting">{valueFromBlockchain}</span>
        </h1>
        <form onSubmit={changeGreeting} className="change">
          <label>Change greeting:</label>
          <div>
            <input
              autoComplete="off"
              defaultValue={valueFromBlockchain}
              id="greetingInput"
            />
            <button>
              <span>Save</span>
              <div className="loader"></div>
            </button>
          </div>
        </form> */}
        <DirectDebit contractIdIn={contractId} walletIn={wallet} />
      </main>
    </>
  );
}
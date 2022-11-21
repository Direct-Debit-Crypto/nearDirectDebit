
import './assets/global.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DirectDebit } from './components/DirectDebit';
import { EducationalText, SignInPrompt, SignOutButton } from './ui-components';
import { MyPayers } from './components/MyPayers';
import { NewInvoice } from './components/NewInvoice';
import NewDirectDebit from './components/NewDirectDebit';


export default function App({ isSignedIn, contractId, wallet }) {
  const [valueFromBlockchain, setValueFromBlockchain] = React.useState();

  /// If user not signed-in with wallet - show prompt
  if (!isSignedIn) {
    // Sign-in flow will reload the page later
    return <SignInPrompt greeting={valueFromBlockchain} onClick={() => wallet.signIn()}/>;
  }

  return (  
    <Routes>
    <Route path='/' element={<DirectDebit walletIn={wallet} contractIdIn={contractId} />} />
    <Route path='/new-direct-debit' element={<NewDirectDebit walletIn={wallet} contractIdIn={contractId} />} />
    <Route path='/list-debits' element={<DirectDebit walletIn={wallet} contractIdIn={contractId} />} />
    <Route path='/whitelisted-vendors' element={<MyPayers walletIn={wallet} contractIdIn={contractId} />} />
    <Route path='/new-invoice' element={<NewInvoice walletIn={wallet} contractIdIn={contractId} />} />
  </Routes>
  );
}
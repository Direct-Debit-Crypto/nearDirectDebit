
import React from 'react';
import Layout from './Layout';


export function Home({contractIdIn, walletIn}) {


    //Add feature
    return (
    <Layout wallet={walletIn}>
        <h2>Welcome to Direct Debit Interface</h2>
        <h3>Inspiration</h3>
        <p>Direct debit it's a tech already exist in Central Finance. Customers have the option to set up whitelisted vendors that will be paid when they emit a new invoice. Starting from this idea I created something similar on NEAR chain.</p>
        <h3>What it does?</h3>
        <p>Using a smart contract that keeps all the logic behind for direct debit we can add whitelist vendors with a certain limit and also supply a deposit. And after that anyone on NEAR meaning any address can create an invoice if it's part of whitelisted and will be paid right away or at a later date when the direct debit owner decide.</p>
        <h3>How we built it</h3>
        <p>In order to build the tech we use smart contracts and we made also a minimal design interface in order to interact with the Smart contract. So a user can easily without so much knowledge create an environment where different suppliers will be paid in an automatic way. JavaScript was used as a front end and typescript to create the smart contracts.</p>
        
        <h3>Challenges we ran into</h3>
        <p>A lot of issues appear during the development process. Most of them were fixed but required a lot of testing and trying. One issue that I can remember very well was the fact that I was trying to get the owner of the contract and save it. I did this as usual in the construct. Well, it looked like any view method was failing due to that. Many more appeared but with support were fixed</p>
        
        <h3>Accomplishments that we're proud of</h3>
        <p>A smart contract was designed and created with all the features in the planning so there was a finished job. A nice-looking UI was prepared and even if we can't do at the moment all the features that were planned such as deploying the contact from the interface. The UI can interact easily with an existing contract and can call all the features available in the contract.</p>
        <h3>What we learned?</h3>
        <p>Little things have the most impact on a project. Time is limited but when you are pressed by time sometimes things take life as fast as you could not imagine. Even though good projects are created in time is impressive what we can do in a small amount of time</p>
        <h3>What's next for Tron Direct Debit?</h3>
        <p>As this is a MVP after feedback taking into consideration we will look into the feasibility and applicability in this tech of the idea and build further.</p>
        <></>
    </Layout>
    );
  }
import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import styles from '../assets/global.css'
import logo from '../assets/logo.png'
import { SignOutButton } from '../ui-components';


export default function Header({wallet}) {
  
    return (
      <Navbar className="header">

        {/* Brand logo */}
        <Container>
          <Navbar.Brand className="headerLogo" href='/'>
            <img src={logo} alt="Logo" width="300"/>
          </Navbar.Brand>
        </Container>

        {/* All Available links */}
        <Container>
          <Nav className="allnav">
            <Nav.Item>
              <Nav.Link href="/list-debits">List Debit</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/new-direct-debit">New Debit</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/whitelisted-vendors">My Payers</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/new-invoice">New Invoice</Nav.Link>
            </Nav.Item>
          </Nav>
        </Container>

        {/* Third element the Connect Button */}
        <Container  className="ConnectHeader">
            <SignOutButton accountId={wallet.accountId} onClick={() => wallet.signOut()}/>
        </Container>
      </Navbar>
    );
};
  
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, ButtonGroup } from 'react-bootstrap';
import { Fragment } from 'react';

function ModuleLinks(){
  return (
        <>
        <Dropdown as={ButtonGroup}>
          <Nav.Link href="/module" className='pe-0'>Module</Nav.Link>
          <Dropdown.Toggle split id="top-nav-module-dropdown"/>
          <Dropdown.Menu>
            <Nav.Link href="/module/addmodule">Add Modules</Nav.Link>
            <Nav.Link href="/module/updatemodule">Update Modules</Nav.Link>
            <Nav.Link href="/module/deletemodule">Delete Modules</Nav.Link>
            

          </Dropdown.Menu>
        </Dropdown>
        
      </>

  )
}
function ConfigLinks(){
  return (
      <>
        <Dropdown as={ButtonGroup}>
          <Nav.Link href="/config" className='pe-0'>Config</Nav.Link>
          <Dropdown.Toggle split id="top-nav-config-dropdown"/>
          <Dropdown.Menu>
            <Nav.Link href="/config/addconfig">Add Configs</Nav.Link>
            <Nav.Link href="/config/updateconfig">Update Configs</Nav.Link>
            <Nav.Link href="/config/deleteconfig">Delete Configs</Nav.Link>
            <Nav.Link href="/config/startconfig">Start Configs</Nav.Link>
            <Nav.Link href="/config/stopconfig">Stop Configs</Nav.Link>

          </Dropdown.Menu>
        </Dropdown>
        
      </>

  )
}
function TestLinks(){
  const check = process.env.NEXT_PUBLIC_IS_TEST_ENV === 'true' ? true : false

  if(check){
    return (
      <>
        <Nav.Link href="/testmodule">TestModule</Nav.Link>
        <Nav.Link href="/testconfiguration">TestConfig</Nav.Link>
        <Nav.Link href="/testgraph">TestGraph</Nav.Link>
        <Nav.Link href="/testnode">TestNode</Nav.Link>

      </>
    )

  }

}

export default function Topbar({ Component, pageProps }) {


  return (
    <Navbar expand="lg" className="bg-body-tertiary" >
      <Container>
        <Navbar.Brand href="/">eIDS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Dashboard</Nav.Link>
            {/* <Nav.Link href="/analytics">Analytics</Nav.Link> */}
            <Nav.Link href="/logs">Logs</Nav.Link>
            <ModuleLinks/>
            <ConfigLinks/>
            {/* <TestLinks/> */}
            {/* { 
              (() => {
                  if(true){
                    return (<TestLinks/>) 
                  }
              })()
            } */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
    
};

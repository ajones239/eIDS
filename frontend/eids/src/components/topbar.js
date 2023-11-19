import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, ButtonGroup } from 'react-bootstrap';

function ModuleLinks(){
  return (
        <>
        <Dropdown as={ButtonGroup}>
          <Nav.Link href="/module" className='pe-0'>Module</Nav.Link>
          <Dropdown.Toggle split id="top-nav-module-dropdown"/>
          <Dropdown.Menu>
            <Nav.Link href="/module/addmodule">Add Modules</Nav.Link>
            <Nav.Link href="/module/updatemodule">Update Modules</Nav.Link>
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
            <Nav.Link href="/testmodule">TestModule</Nav.Link>
            <Nav.Link href="/testconfiguration">TestConfig</Nav.Link>
          </Dropdown.Menu>
        </Dropdown>
        
      </>

  )
}
export default function Topbar({ Component, pageProps }) {


  return (
    <Navbar expand="lg" className="bg-body-tertiary" >
      <Container>
        <Navbar.Brand href="#home">eIDS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Dashboard</Nav.Link>
            <Nav.Link href="/analytics">Analytics</Nav.Link>
            <Nav.Link href="/logs">Logs</Nav.Link>
            <Nav.Link href="/configuration">Config</Nav.Link>
            <ModuleLinks/>
            <ConfigLinks/>
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
    
};

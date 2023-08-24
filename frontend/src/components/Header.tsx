import { Navbar, Nav, Container, Badge } from "react-bootstrap"
import { FaShoppingCart, FaUser } from "react-icons/fa"
import logo from "../assets/logo.png";
import {LinkContainer} from "react-router-bootstrap"
import { useSelector } from "react-redux";
import { CartState } from "../utils/cartUtils";
export const Header = () => {

  const { cartItems } = useSelector<any, CartState>((state) => state.cart)

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
          <Navbar.Brand> <img src={logo} alt="ProShop"></img>ProShop</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <LinkContainer to="/cart">
                <Nav.Link> 
                  <FaShoppingCart/> Cart 
                  { cartItems.length > 0 && (<Badge pill bg="success" style={{marginLeft:"5px"}}> {cartItems.reduce((a,c)=> a+c.qty, 0)} </Badge>)}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/login"><Nav.Link> <FaUser/> Sign In</Nav.Link></LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

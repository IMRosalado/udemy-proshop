import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap"
import { FaShoppingCart, FaUser } from "react-icons/fa"
import logo from "../assets/logo.png";
import {LinkContainer} from "react-router-bootstrap"
import { useDispatch, useSelector } from "react-redux";
import { CartState } from "../utils/cartUtils";
import { AuthState, logout } from "../slices/authSlice";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SearchBox from "./SearchBox";

export const Header = () => {

  const { cartItems } = useSelector<any, CartState>((state) => state.cart)
  const { userInfo }  = useSelector<any, AuthState>(state => state.auth);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApicall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApicall().unwrap();
      dispatch(logout({}));
      navigate('/login')
    } catch (error:any) {
      toast.error(error.data.message || error.error);
    }
  }
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
              <SearchBox/>
              <LinkContainer to="/cart">
                <Nav.Link> 
                  <FaShoppingCart/> Cart 
                  { cartItems.length > 0 && (<Badge pill bg="success" style={{marginLeft:"5px"}}> {cartItems.reduce((a,c)=> a+c.qty, 0)} </Badge>)}
                </Nav.Link>
              </LinkContainer>
              { userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/profile"><NavDropdown.Item>Profile</NavDropdown.Item></LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (<LinkContainer to="/login"><Nav.Link> <FaUser/> Sign In</Nav.Link></LinkContainer> )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminMenu">
                  <LinkContainer to="/admin/products">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orders">
                    <NavDropdown.Item>Order List</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/users">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

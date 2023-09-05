import { useState, useEffect} from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CartState } from '../utils/cartUtils'
import { savePaymentMethod } from '../slices/cartSlice'


const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cart = useSelector<any, CartState>((state) => state.cart)
  const { shippingAddress } = cart;
  useEffect(()=>{
    if(!shippingAddress) {
      navigate("/shipping")
    }
  },[shippingAddress, navigate])
  const submitHandler = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    navigate("/placeorder")
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3/>
      <h1>Payment</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              className="my-2"
              label="PayPal or Credit Card"
              id="PayPal"
              value="PayPal"
              name="paymentMethod"
              checked
              onChange={e => setPaymentMethod(e.target.value)}/>
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary">Continue</Button>
      </Form>
    </FormContainer>
  )
}

export default PaymentScreen
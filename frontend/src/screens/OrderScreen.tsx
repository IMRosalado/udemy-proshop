import { useParams } from "react-router-dom"
import { Row, Col, ListGroup, Image, Button, Card } from "react-bootstrap"
import Message from "../components/Message"
import Loader from "../components/Loader"
import { useGetOrderDetailsQuery , usePayOrderMutation, useGetPayPalClientIdQuery, useDeliverOrderMutation } from "../slices/ordersApiSlice"
import { PayPalButtons, usePayPalScriptReducer, SCRIPT_LOADING_STATE } from "@paypal/react-paypal-js"
import {CreateOrderData, CreateOrderActions, OnApproveActions, OnApproveData, } from "@paypal/paypal-js"
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux';
import { AuthState } from "../slices/authSlice"
import { useEffect } from 'react';
import { formatFetchError } from "../utils/errorUtils"

const OrderScreen = () => {
  const { id: orderId } = useParams()
  
  const { data: order, refetch, isLoading, error} = useGetOrderDetailsQuery(orderId||'');

  // paying
  const [payOrder, {isLoading: isLoadingPay}] = usePayOrderMutation()

  const [deliverOrder, {isLoading: isLoadingDeliver}] = useDeliverOrderMutation();

  const [{isPending}, paypalDispatch] = usePayPalScriptReducer();

  // getting paypal client id
  const { data:paypal, isLoading: isLoadingPaypal, error: errorPaypal} = useGetPayPalClientIdQuery({});

  const { userInfo } = useSelector<any, AuthState>((state) => state.auth)


  const createOrder = (data:CreateOrderData, actions:CreateOrderActions):Promise<string> => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: String(order?.totalPrice)
          }
        }
      ]
    }).then((orderId) => {
      return orderId
    })
  }

  const onApprove = (data:OnApproveData, actions:OnApproveActions):Promise<void> => {
    return actions.order?.capture().then(async function (details) {
      try {
        await payOrder({orderId:orderId||"", details}).unwrap();
        refetch()
        toast.success("Payment Successful")
        
      } catch (error:any) {
        refetch()
        toast.error(error?.data?.message || error.message)
        
      }
    }) || new Promise(()=>{})
  }

  const onError = (error:Record<string, unknown>) => {
    toast.error( String(error.message))
  }

  useEffect(()=>{
    if( !errorPaypal && !isLoadingPaypal && paypal.clientId) {
      //if paypal loaded, load paypal scripts
      const loadPaypalScripts = async() => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            clientId: paypal.clientId,
            currency: 'USD'
          }
        });
        paypalDispatch({type: 'setLoadingStatus', value: SCRIPT_LOADING_STATE.PENDING})
      }

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScripts();
        }
      }

    }
  },[order, paypal, paypalDispatch, isLoadingPaypal, errorPaypal])

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId||"");
      refetch()
      toast.success("Order delivered");
    } catch (err:any) {
      toast.error(err?.data?.message || err.message)
    }
  }

  return isLoading ? <Loader/> : error ? <Message variant="danger">{formatFetchError(error)}</Message> : order ?
  <>
    <h1>Order {order._id}</h1>
    <Row>
      <Col md={8}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <h2>Shipping</h2>
            <p>
              <strong>Name:</strong> {order.user.name}
            </p>
            <p>
              <strong>Email:</strong> {order.user.email}
            </p>
            <p>
              <strong>Address:</strong> 
              {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {order.isDelivered && order.deliveredAt? (<Message variant="success">Delivered on {order.deliveredAt.toString()} </Message>) : (<Message variant="danger">Not delivered </Message>)}
          </ListGroup.Item>
          <ListGroup.Item>
            <h2>Payment Method</h2>
            <p>
              <strong>Method:</strong> {order.paymentMethod}
              {order.isPaid && order.paidAt? (<Message variant="success">Paid on {order.paidAt.toString()} </Message>) : (<Message variant="danger">Not Paid </Message>)}
            </p>
          </ListGroup.Item>
          <ListGroup.Item>
            <h2>Order Items</h2>
            {order.orderItems.map((item, index) => (
              <ListGroup.Item key={index}>
                <Row>
                  <Col md={1}><Image src={item.image} alt={item.name}/></Col>
                  <Col md={4}>{item.qty} x ${item.price} = ${item.qty * item.price}</Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup.Item>
        </ListGroup>
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2> Order Summary</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Items</Col>
                <Col>${order.itemsPrice}</Col>
              </Row>
              <Row>
                <Col>Shipping</Col>
                <Col>${order.shippingPrice}</Col>
              </Row>
              <Row>
                <Col>Tax</Col>
                <Col>${order.taxPrice}</Col>
              </Row>
              <Row>
                <Col>Total</Col>
                <Col>${order.totalPrice}</Col>
              </Row>
            </ListGroup.Item>
            {order.isPaid}
            { !order.isPaid && (
              <ListGroup.Item>
                {isLoadingPay && <Loader/>}

                {isPending ? <Loader/> : (
                  <>
                    {/*<Button onClick={onApproveTest} style={{marginBottom: "10px"}}>Test Pay Order!</Button>*/}
                    <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError}/>
                  </>
                )}
              </ListGroup.Item>
            )}

            { isLoadingDeliver && <Loader/>}
            { userInfo &&  userInfo.isAdmin && order.isPaid && !order.isDelivered &&
              <ListGroup.Item>
                <Button type="button" className="btn btn-block" onClick={deliverHandler}>Mark As Delivered</Button>
              </ListGroup.Item>
            }
          </ListGroup>
        </Card>
      </Col>
    </Row>
  </> : <Message variant="danger">Not Found</Message>
}

export default OrderScreen
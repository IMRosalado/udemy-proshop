import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Order from "../../models/Order";

const OrderListScreen = () => {

  const { data:orders, isLoading, error} = useGetOrdersQuery(null);

  return (
    <>
      <h1>Orders</h1>
      { isLoading ? <Loader/> : error? <Message variant="danger">{'error' in error ? error.error : ""}</Message> : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order:Order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.toString().substring(0,10)}</td>
                <td>${order.totalPrice}</td>
                <td>{order.isPaid && order.paidAt? (order.paidAt.toString().substring(0,10)): (<FaTimes color="red"/>)}</td>
                <td>{order.isDelivered && order.deliveredAt? (order.deliveredAt.toString().substring(0,10)): (<FaTimes color="red"/>)}</td>
                <td>
                  <LinkContainer to={`/orders/${order._id}`}>
                    <Button className="btn-sm" variant="light">Details</Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default OrderListScreen
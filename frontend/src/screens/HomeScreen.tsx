import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";

const HomeScreen = () => {
  
  const { data: products, isLoading, isError } = useGetProductsQuery(null); 
  
  return (
    <>
      { isLoading ? (<Loader/>)
      : isError? <Message variant="danger">(error.data.message || error.error)</Message>
      :(<>
      <h1>Latest Products</h1>
      <Row>
        { products && products.map((product) => {
          return <Col sm={12} md={6} lg={4} xl={3}>
            <Product key={product._id} product={product}/>
          </Col>
        })}
      </Row>
      </>)}
      
    </>
  )
}

export default HomeScreen
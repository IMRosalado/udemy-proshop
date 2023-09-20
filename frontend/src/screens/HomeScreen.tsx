import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link, useParams } from "react-router-dom";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import { formatFetchError } from "../utils/errorUtils";

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams()
  
  const { data, isLoading, error } = useGetProductsQuery({pageNumber: pageNumber||"1", keyword:keyword||""}); 
  
  return (
    <>
      { keyword ? <Link to="/" className="btn btn-light">Go Back</Link> : (
        <ProductCarousel/>
      )}
      { isLoading ? (<Loader/>)
      : error? <Message variant="danger">{formatFetchError(error)}</Message>
      :(<>
      <h1>Latest Products</h1>
      <Row>
        { data && data.products && data.products.map((product, index) => {
          return <Col sm={12} md={6} lg={4} xl={3} key={index}>
            <Product key={product._id} product={product}/>
          </Col>
        })}
      </Row>
      <Paginate pages={data?.pages||1} currentPage={data?.page||1} keyword={keyword}/>
      </>)}
      
    </>
  )
}

export default HomeScreen
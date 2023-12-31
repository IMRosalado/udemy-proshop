import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button, Form } from "react-bootstrap";
import Rating from "../components/Rating";

import { useGetProductDetailsQuery, useCreateReviewMutation } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useState } from "react";
import { addToCart } from "../slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AuthState } from "../slices/authSlice";
import Meta from "../components/Meta";
import { formatFetchError } from "../utils/errorUtils";

const ProductScreen = () => {
  const {id: productId} = useParams();
  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId||''); 

  const [createReview, { isLoading: isLoadingCreateReview }] = useCreateReviewMutation();
  
  const [ qty, setQty ] = useState(1);
  const [ rating, setRating ] = useState(0);
  const [ comment, setComment ] = useState("")

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector<any, AuthState>(state => state.auth)
  
  const addToCartHandler = () => {
    dispatch(addToCart({...product, qty}))
    navigate('/cart');
  }
  const createReviewHandler = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment
      }).unwrap();

      refetch();
      toast.success("Review Submitted");
      setRating(0)
      setComment("")

    } catch (e:any) {
      toast.error(e?.data?.message || e.error);

    }
  }

  return (
    <>
      { isLoading ? <Loader/>
      : error? (<Message variant="danger">{formatFetchError(error)}</Message>)
      :(<>
        <Link className="btn btn-light my-3" to="/">
          Go Back
        </Link>
        {product && <>
        <Meta title={product.name} description={product.description}/>
        <Row>
          <Col md={5}>
            <Image src={product.image} alt={product.name} fluid/>
          </Col>
          <Col md={4}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating value={product.rating} text={`${product.numReviews} reviews`}/>
              </ListGroup.Item>
              <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
              <ListGroup.Item>Description: {product.description}</ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col><strong>${product.price}</strong></Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col><strong>{product.countInStock>0 ? 'In Stock': 'Out Of Stock'}</strong></Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty</Col>
                      <Col>
                        <Form.Control as="select" 
                          value={qty} 
                          onChange={(e) => setQty(Number(e.target.value))}>
                        {[...Array(product.countInStock).keys()].map(num => <option key={num+1} value={num+1}>{num+1}</option>)} 
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>)}
                <ListGroup.Item>
                  <Button className="btn-block" type="button" disabled={!product.countInStock}
                    onClick={addToCartHandler}>Add to Cart</Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row> 
        <Row className="my-3">
          <Col md={6}>
            <h2>Reviews</h2>
            { product.reviews.length === 0 && <Message>No Reviews</Message>}
            <ListGroup variant="flush">
              { product.reviews.map(review => (
                <ListGroup.Item key={review._id}>
                  <strong>{review.name}</strong>
                  <Rating value={review.rating}/>
                  <p>{review.createdAt.toString().substring(0,10)}</p>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))}
              <ListGroup.Item>
                <h2>Write a Customer Review</h2>
                { isLoadingCreateReview && <Loader/>}
                { userInfo ? (
                  <Form onSubmit={createReviewHandler}>
                    <Form.Group controlId="rating" className="my-2">
                      <Form.Label>Rating</Form.Label>
                      <Form.Control
                        as="select"
                        value={rating}
                        onChange={(e)=> setRating(Number(e.target.value))}>
                          <option value="">Select...</option>
                          <option value="1">1  - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="comment" className="my-2">
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={comment}
                        onChange={e => setComment(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Button
                      disabled={isLoadingCreateReview}
                      type="submit"
                      variant="primary">Submit</Button>
                  </Form>
                ) : (<Message>Please <Link to="/login">login</Link> to write a review.</Message>) }
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>  
      </>
      }</>)
    }
    </> 
  )
}

export default ProductScreen
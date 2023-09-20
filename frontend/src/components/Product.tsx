import { Card } from "react-bootstrap";
import { Product as ProductType } from "../models/Product";
import {Link } from "react-router-dom";
import Rating from "./Rating";
interface ProductProps {
  product:ProductType
}
const Product = ({product}:ProductProps) => {
  return (
    <Card className="my-3 p-3 rounded" >
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image.replaceAll('\\','/')} variant="top"/>
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div" className="product-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <Rating value={product.rating} text={`${product.numReviews} Reviews`}/>
        </Card.Text>
        <Card.Text as="h3">
          ${product.price}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
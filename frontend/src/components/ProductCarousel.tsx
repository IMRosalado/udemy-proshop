import { Carousel, Image } from "react-bootstrap"
import { useGetTopProductsQuery } from "../slices/productsApiSlice"
import Loader from "./Loader";
import Message from "./Message";
import { Link } from "react-router-dom";
import { formatFetchError } from "../utils/errorUtils";

const ProductCarousel = () => {

  const {data: products, isLoading, error} = useGetTopProductsQuery(null);
  return isLoading? <Loader/> : error? <Message variant="danger">{formatFetchError(error)}</Message>
    : products ? (
      <Carousel pause="hover" className="bg-primary mb-4">
        {products.map(product => (
          <Carousel.Item key={product._id}>
            <Link to={`/product/${product._id}`}>
              <Image src={product.image} alt={product.name} fluid/>
              <Carousel.Caption className="carousel-caption">
                <h2>{product.name} (${product.price})</h2>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>
    ) : <div></div>
}

export default ProductCarousel
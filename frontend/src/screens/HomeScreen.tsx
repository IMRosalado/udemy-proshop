import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useEffect, useState } from "react";
import axios from "axios";
import { Product as ProductType} from "../models/Product";

const HomeScreen = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  useEffect(()=>{
    const fetchProducts = async()=> {
      const {data} = await axios.get('/api/products');
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        { products.map((product) => {
          return <Col sm={12} md={6} lg={4} xl={3}>
            <Product key={product._id} product={product}/>
          </Col>
        })}
      </Row>
    </>
  )
}

export default HomeScreen
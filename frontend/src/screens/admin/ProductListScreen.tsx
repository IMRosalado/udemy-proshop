import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery } from "../../slices/productsApiSlice";
import { toast } from "react-toastify";

const ProductListScreen = () => {

  const { data:products, isLoading, error, refetch} = useGetProductsQuery(null);
  const [createProduct, { isLoading: isLoadingCreate}] = useCreateProductMutation();
  const [deleteProduct, { isLoading: isLoadingDelete}] = useDeleteProductMutation();

  const deleteHandler = async (productId:string) => {
    if (window.confirm("Are you sure you want to delete product?")) {
      try {
        await deleteProduct(productId);
        refetch()
        toast.success("Product Deleted")
      } catch (err:any) {
        toast.error(err?.data?.message || err.message)
      }
    }
  }

  const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        await createProduct(null);
        refetch()
      } catch (err:any) {
        toast.error(err?.data?.message || err.message)
      }
    }
  }

  return (
    <>
      <Row className="align-items-center">
        <Col><h1>Products</h1></Col>
        <Col className="text-end"><Button className="btn-sm m-3" onClick={createProductHandler}><FaEdit/> Create Product</Button></Col>
      </Row>
      { isLoadingCreate && <Loader/>}
      { isLoadingDelete && <Loader/>}
      { isLoading ? <Loader/> : error? <Message variant="danger">{'error' in error ? error.error : ""}</Message> : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products && products.map((product) => 
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/products/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2"><FaEdit/></Button>
                    </LinkContainer>
                    <Button variant="light" className="btn-sm" onClick={()=>deleteHandler(product._id)}><FaTrash /></Button>
                  </td>
                </tr>
              )}
            </tbody>

          </Table>
        </>
      ) }
    </>
  )
}

export default ProductListScreen
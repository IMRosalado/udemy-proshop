import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import { toast } from "react-toastify";
import { useUpdateProductMutation, useGetProductDetailsQuery, useUploadProductImageMutation } from "../../slices/productsApiSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";


const EditProductScreen = () => {
  const { id:productId } = useParams();

  const [name, setName]  = useState("")
  const [price, setPrice]  = useState(0)
  const [image, setImage]  = useState("")
  const [brand, setBrand]  = useState("")
  const [category, setCategory]  = useState("")
  const [countInStock, setCountInStock]  = useState(0)
  const [description, setDescription]  = useState("")

  const { data: product, isLoading, error} = useGetProductDetailsQuery(productId||"");
  
  const [ updateProduct, { isLoading: isLoadingUpdate }] = useUpdateProductMutation();

  const [ uploadProductImage] = useUploadProductImageMutation();

  const navigate = useNavigate();

  useEffect(()=> {
    if ( product ) {
      setName(product.name)
      setPrice(product.price)
      setImage(product.image)
      setBrand(product.brand)
      setCategory(product.category)
      setCountInStock(product.countInStock)
      setDescription(product.description)
    }
  }, [ product ])

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        productId,
        name,
        price,
        image,
        brand, 
        category, 
        countInStock, 
        description
      }

      const result = await updateProduct(updatedProduct);

      if ("error" in result && result.error)  {
        toast.error(result.error.toString());
      } else {
        toast.success("Product Updated");
        navigate("/admin/products");
      }

    } catch (err: any) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
      const formData = new FormData();
      formData.append('image',e.target.files[0])

      try {
        const res = await uploadProductImage(formData).unwrap();

        toast.success(res.message);
        setImage(res.image);
      } catch(err: any) {
        toast.error(err?.data?.message || err.error)

      }
    }
  }

  return (
    <>
      <Link to={`/admin/products`} className="btn btn-light my-3">Go Back </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        { isLoadingUpdate && <Loader/> }

        { isLoading ? <Loader/> : error ? (<Message variant="danger">{error.toString()}</Message>) : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name" className="my-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}/>
              </Form.Group>
              <Form.Group controlId="price" className="my-2">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  name="price"
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e)=>setPrice(Number(e.target.value))}/>
              </Form.Group>
              
              <Form.Group controlId="image" className="my-2">
                <Form.Label>Image</Form.Label>
                <Form.Control 
                  type="text"
                  placeholder="Enter image url"
                  value={image}
                  onChange={(e)=>setImage(e.target.value)}></Form.Control>
                <Form.Control
                  type="file"
                  onChange={uploadFileHandler}/>
              </Form.Group>

              <Form.Group controlId="brand" className="my-2">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  name="brand"
                  placeholder="Enter brand"
                  value={brand}
                  onChange={(e)=>setBrand(e.target.value)}/>
              </Form.Group>
              <Form.Group controlId="category" className="my-2">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  name="category"
                  placeholder="Enter category"
                  value={category}
                  onChange={(e)=>setCategory(e.target.value)}/>
              </Form.Group>
              <Form.Group controlId="countInStock" className="my-2">
                <Form.Label>Count In Stock</Form.Label>
                <Form.Control
                  name="countInStock"
                  type="number"
                  placeholder="Enter count in stock"
                  value={countInStock}
                  onChange={(e)=>setCountInStock(Number(e.target.value))}/>
              </Form.Group>
              <Form.Group controlId="description" className="my-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  name="description"
                  placeholder="Enter description"
                  type="textarea"
                  value={description}
                  onChange={(e)=>setDescription(e.target.value)}/>
              </Form.Group>

              <Button variant="primary" type="submit" className="my-2">Update</Button>
            </Form>
        )}
      </FormContainer>
    </>
  )
}

export default EditProductScreen
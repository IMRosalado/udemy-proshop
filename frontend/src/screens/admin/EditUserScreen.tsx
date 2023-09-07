import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import { toast } from "react-toastify";
import { useUpdateProductMutation, useGetProductDetailsQuery, useUploadProductImageMutation } from "../../slices/productsApiSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../../slices/usersApiSlice";


const EditUserScreen = () => {
  const { id:userId } = useParams();

  const [name, setName]  = useState("")
  const [email, setEmail]  = useState("")
  const [isAdmin, setIsAdmin]  = useState(false)

  const { data: user, isLoading, error} = useGetUserByIdQuery(userId||"");
  
  const [ updateUser, { isLoading: isLoadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  useEffect(()=> {
    if ( user ) {
      setName(user.name)
      setEmail(user.email)
      setIsAdmin(user.isAdmin)
    }
  }, [ user ])

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const updatedUser = {
        userId,
        name,
        email,
        isAdmin
      }
      const result = await updateUser(updatedUser);

      if ("error" in result && result.error)  {
        toast.error(result.error.toString());
      } else {
        toast.success("User Updated");
        navigate("/admin/users");
      }

    } catch (err: any) {
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
    <>
      <Link to={`/admin/users`} className="btn btn-light my-3">Go Back </Link>
      <FormContainer>
        <h1>Edit User</h1>
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
              <Form.Group controlId="email" className="my-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}/>
              </Form.Group>
              
              <Form.Group controlId="isAdmin" className="my-2">
                <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e)=>setIsAdmin(e.target.checked)}/>
              </Form.Group>
              <Button variant="primary" type="submit" className="my-2">Update</Button>
            </Form>
        )}
      </FormContainer>
    </>
  )
}

export default EditUserScreen
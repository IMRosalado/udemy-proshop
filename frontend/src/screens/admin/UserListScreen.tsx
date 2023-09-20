import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaTimes, FaTrash, FaCheck, FaEdit } from "react-icons/fa";
import { useDeleteUserMutation, useGetUsersQuery } from "../../slices/usersApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { User } from "../../models/User";
import { toast } from "react-toastify";
import { formatFetchError } from "../../utils/errorUtils";

const UserListScreen = () => {

  const { data:users, isLoading, error, refetch} = useGetUsersQuery(null);

  const [deleteUser, { isLoading: isLoadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (userId: string) => {
    if( window.confirm("Are you sure you want to delete user?")) {
      try {
        await deleteUser(userId);
        refetch();
        toast.success("User Deleted");
      } catch (err: any) {
        toast.error(err?.data?.message || err.message);

      }
    }
  }

  return (
    <>
      <h1>Users</h1>
      {isLoadingDelete && <Loader/>}
      { isLoading ? <Loader/> : error? <Message variant="danger">{formatFetchError(error)}</Message> : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users && users.map((user: User) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                <td>{user.isAdmin? <FaCheck color="green"/> : <FaTimes color="red"/>}</td>
                <td>
                  <LinkContainer to={`/admin/users/${user._id}/edit`}>
                    <Button className="btn-sm" variant="light"><FaEdit/></Button>
                  </LinkContainer>
                  <Button variant="light" className="btn-sm" onClick={()=>deleteHandler(user._id)}><FaTrash /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default UserListScreen
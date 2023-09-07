import { Outlet, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { AuthState } from "../slices/authSlice"

const AdminRoute = () => {

  const { userInfo } = useSelector<any, AuthState>(state => state.auth)
  return userInfo && userInfo.isAdmin ? <Outlet/> : <Navigate to="/login" replace/>
}

export default AdminRoute
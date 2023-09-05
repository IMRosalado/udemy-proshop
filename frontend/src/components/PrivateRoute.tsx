import { Outlet, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { AuthState } from "../slices/authSlice"

const PrivateRoute = () => {

  const userInfo = useSelector<any, AuthState>(state => state.auth)
  return userInfo ? <Outlet/> : <Navigate to="/login" replace/>
}

export default PrivateRoute
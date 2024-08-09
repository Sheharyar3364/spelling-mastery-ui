import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext'

const PrivateRoutes = () => {
    let { user } = useContext(AuthContext)
    //   const { user } = useContext(AuthContext)

    return !user ? <Navigate to="/login" /> : <Outlet />
};

export default PrivateRoutes;
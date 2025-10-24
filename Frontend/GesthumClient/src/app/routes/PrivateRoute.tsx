import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../ui/hooks/useAuth'

interface PrivateRouteProps {
    allowedRoles?:string[],
    children:React.ReactNode
}

const PrivateRoute = ({children, allowedRoles}: PrivateRouteProps) => {
  
  const {userClaims , isAuthenticated} = useAuth();
  if(!isAuthenticated){
    return <Navigate to='/' replace />;
  }

  if(allowedRoles && !allowedRoles.includes(userClaims!.role)){
    return <Navigate to='/unauthorized' replace/>;
  }
  
  return children;
}

export default PrivateRoute
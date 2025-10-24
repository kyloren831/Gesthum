import './App.css'
import EmployeeDashboard from './ui/pages/employees/EmployeeDashboard'
import Login from './ui/pages/Login'
import  PrivateRoute  from './app/routes/PrivateRoute'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './app/providers/AuthProvider'
import AdminDashboard from './ui/pages/admins/AdminDashboard'
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route 
          path='/emplDash' 
          element={
            <PrivateRoute allowedRoles={['Employee']}>
              <EmployeeDashboard/>
            </PrivateRoute>}>
          </Route>
          <Route 
          path='/adminDash' 
          element={
            <PrivateRoute allowedRoles={['Admin']}>
              <AdminDashboard/>
            </PrivateRoute>}>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

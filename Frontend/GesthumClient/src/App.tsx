import './App.css'
import EmployeeDashboard from './ui/pages/employees/EmployeeDashboard'
import EmployeeProfile from './ui/pages/employees/EmployeeProfile'
import Login from './ui/pages/Login'
import  PrivateRoute  from './app/routes/PrivateRoute'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './app/providers/AuthProvider'
import AdminDashboard from './ui/pages/admins/AdminDashboard'
import VacanciesPage from './ui/pages/vacancies/VacanciesPage'
import UpdatePhotoModal from './ui/components/photoModal/UpdatePhotoModal'
import ApplicationsPage from './ui/pages/applications/ApplicationsPage'
import ResumesPage from './ui/pages/resumes/ResumesPage'
import CreateResume from './ui/pages/resumes/CreateResume'
import ApplicationDetailPage from './ui/pages/applications/ApplicationDetailPage'
import EvaluationDetailPage from './ui/pages/evaluations/EvaluationDetailPage'

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
              </PrivateRoute>
            }>
          </Route>
          <Route 
            path='/adminDash' 
            element={
              <PrivateRoute allowedRoles={['Admin']}>
                <AdminDashboard/>
              </PrivateRoute>
            }>
          </Route>

          <Route
            path='/vacantes'
            element={
              <PrivateRoute allowedRoles={['Admin','Employee']}>
                <VacanciesPage />
              </PrivateRoute>
            }
          />

          {/* Ruta de perfil de empleado */}
          <Route
            path='/employees/profile'
            element={
              <PrivateRoute allowedRoles={['Employee']}>
                <EmployeeProfile />
              </PrivateRoute>
            }
          />

          {/* Ruta de solicitudes / aplicaciones */}
          <Route
            path='/applications'
            element={
              <PrivateRoute allowedRoles={['Admin','Employee']}>
                <ApplicationsPage />
              </PrivateRoute>
            }
          />

          {/* Nueva ruta: detalle de una aplicación (application) */}
          <Route
            path='/applications/:id'
            element={
              <PrivateRoute allowedRoles={['Admin','Employee']}>
                <ApplicationDetailPage />
              </PrivateRoute>
            }
          />

          {/* Rutas para evaluaciones */}
          <Route
            path='/evaluations/detail'
            element={
              <PrivateRoute allowedRoles={['Admin','Employee']}>
                <EvaluationDetailPage />
              </PrivateRoute>
            }
          />

          {/* Ruta para ver el CV (visible sólo para empleados) */}
          <Route
            path='/resumes'
            element={
                <PrivateRoute allowedRoles={['Admin', 'Employee']}>
                <ResumesPage />
              </PrivateRoute>
            }
          />

          {/* Página para crear CV (misma estructura que CreateVacancy) */}
          <Route
            path='/resumes/create'
            element={
              <PrivateRoute allowedRoles={['Employee']}>
                <CreateResume />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>

      { /* Modal global que se abre cuando userClaims?.isFirstLogin === true */ }
      <UpdatePhotoModal />
    </AuthProvider>
  )
}

export default App

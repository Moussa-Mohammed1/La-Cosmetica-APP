import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/auth/Login'
import  Dashboard  from './pages/admin/Dashboard'
import Register from './pages/auth/Register'
import ClientProducts from './pages/client/Products'
import AdminProducts from './pages/admin/Products'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/products' element={<ClientProducts/>}/>
      <Route path='/dashboard' element={<Dashboard/>} allowedRoles={["admin"]}/>
      <Route path='/admin/products' element={<AdminProducts/>} allowedRoles={["admin"]}/>
    </Routes>
  )
}

export default App

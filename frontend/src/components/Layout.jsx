import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

function Layout() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../components/Header.jsx'
import Sidebar from "../../components/Sidebar.jsx"
export default function Layout({ currentUser,setCurrentUser }) {
    const [sidebarOpen,setSidebarOpen] = useState(false)
    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <Header currentUser={currentUser} setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} setCurrentUser={setCurrentUser} />
                <div className="flex">
                    <Sidebar
                        // currentPage={currentPage}
                        // onNavigate={setCurrentPage}
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                    />
                </div>
                <div className=' lg:ml-64 m-auto pt-[4rem]'>
                    <Outlet  />
                </div>
                </div>
            </>
            )
}

'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

const Navbar = () => {
    const { data: session } = useSession()
    const user = session?.user

    return (
        <nav className="bg-gray-900 border-b border-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="text-xl font-bold text-white hover:text-indigo-400 transition-colors duration-200">
                        Mystery Message
                    </Link>
                    
                    {session ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-300 hidden sm:block">
                                Welcome {user?.username || user?.email}
                            </span>
                            <button 
                                onClick={() => signOut()}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link href="/sign-in">
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium">
                                Login
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
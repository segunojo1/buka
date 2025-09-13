import React from 'react'
import Logo from './logo'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className='flex items-center justify-between p-4 bg-white shadow-md'>
      <Logo />
      <ul className='flex space-x-4'>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/search">Search</Link></li>
        <li><Link href="/chat">Chat</Link></li>
        <li><Link href="/spots">Spots</Link></li>
      </ul>
      
    </nav>
  )
}

export default Navbar
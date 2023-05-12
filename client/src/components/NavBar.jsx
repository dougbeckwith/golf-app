import React, {useState} from 'react'
import {FaBars, FaTimes} from 'react-icons/fa'
import {NavLink} from 'react-router-dom'

const Navbar = () => {
  // State And Function Toggle Nav Menu
  const [isFaTimes, setIsFaTimes] = useState(false)
  const toggleIcon = () => {
    setIsFaTimes(!isFaTimes)
  }

  return (
    //border-b-2 border-opacity-10 border-gray-200
    <nav className='w-full h-[90px] bg-dark-500 '>
      <div className='h-full mx-auto flex justify-between items-center px-3 sm:px-0'>
        <p className='sm:pl-4 text-xl sm:text-2xl md:text-3xl  font-semibold text-blue-400'>
          Golf Stats
        </p>
        {/* Desktop Links */}
        <ul className='hidden md:flex'>
          <li className=' px-3 font-medium py-10'>
            <NavLink
              className='text-gray-400  hover:bg-dark-200 hover:text-white px-3 py-2 rounded-md'
              to='/clubs'>
              Clubs
            </NavLink>
          </li>
          {/* <li className=' px-3 font-medium py-10'>
            <NavLink
              className='text-gray-400  hover:bg-dark-200 hover:text-white px-3 py-2 rounded-md'
              to='/clubs'>
              Logout
            </NavLink>
          </li> */}
        </ul>
        <div className='block md:hidden cursor-pointer z-10 pl-2'>
          {isFaTimes ? (
            <FaTimes onClick={toggleIcon} size={30} color={'#9ca3af'} />
          ) : (
            <FaBars onClick={toggleIcon} size={30} color={'#9ca3af'} />
          )}
        </div>
      </div>

      {/* Mobile Links */}
      {isFaTimes && (
        <ul
          onClick={toggleIcon}
          className=' text-2xl absolute md:hidden top-[90px] left-0 w-full h-screen bg-dark-500 flex flex-col items-center z-10'>
          <li className=' px-3 font-medium py-10'>
            <NavLink
              className='text-gray-400  hover:bg-dark-200 hover:text-white px-3 py-2 rounded-md'
              to='/clubs'>
              Clubs
            </NavLink>
          </li>
          <li className=' px-3 font-medium py-10'>
            <NavLink
              className='text-gray-400  hover:bg-dark-200 hover:text-white px-3 py-2 rounded-md'
              to='/'>
              Logout
            </NavLink>
          </li>
        </ul>
      )}
    </nav>
  )
}

export default Navbar

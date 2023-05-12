import React from 'react'
import {Link} from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='bg-dark-400 text-gray-300 h-screen flex justify-center items-center'>
      <div className='text-center'>
        <h1 className='text-7xl mb-8'>Oops!</h1>
        <p className='text-4xl mb-8'>404 - Page Not Found!</p>
        <Link to='/clubs'>
          <button
            type='button'
            className='px-4 py-2 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-blue-400 hover:bg-blue-300 '>
            Try Demo
          </button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound

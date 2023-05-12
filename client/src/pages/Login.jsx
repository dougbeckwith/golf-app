import {useState, useEffect, useRef} from 'react'
import {useNavigate} from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()

  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // State for button disabled if making sign up request
  const [isLoading, setIsloading] = useState(false)

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }
  const navigateToCreateAccount = () => {
    navigate('/signup')
  }

  // Focus input on load
  const inputReference = useRef(null)
  useEffect(() => {
    inputReference.current.focus()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('login handle submit')
    setError('Login Not Working Yet')
    setIsloading(true)
  }

  return (
    <>
      <div className='h-screen bg-dark-500 flex pt-10 sm:pt-24 justify-center text-gray-400'>
        <div className='container max-w-[600px]'>
          <h2 className='w-full text-center pb-4 text-lg md:text-2xl'>
            Log into Golf Stats
          </h2>
          <div className='sm:bg-dark-400 px-3 py-4 md:px-6 md:py-8 sm:rounded-lg w-full'>
            <form>
              <div>
                <div className='pb-1 pl-1'>
                  <label htmlFor='email' className='text-lg text-gray-400'>
                    Email
                  </label>
                </div>
                <input
                  ref={inputReference}
                  id='email'
                  type='text'
                  onChange={handleEmailChange}
                  className='bg-dark-200 placeholder-opacity-60 placeholder-gray-600 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400  focus:ring-blue-400'
                  placeholder='John@gmail.com'
                  value={email}
                />
              </div>
              <div className='pt-2 pb-4'>
                <div className='pb-2 pl-1'>
                  <label htmlFor='password' className='text-lg'>
                    Password
                  </label>
                </div>
                <input
                  id='password'
                  type='password'
                  onChange={handlePasswordChange}
                  className='bg-dark-200 placeholder-opacity-60 placeholder-gray-600 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400  focus:ring-blue-400'
                  placeholder='Password'
                  value={password}
                />
              </div>
              {error && <p className='text-red'>{error}</p>}
              <button
                disabled={isLoading}
                onClick={handleSubmit}
                className='mt-4 w-full bg-blue-400 py-3 rounded-md hover:bg-blue-300'>
                Login
              </button>
              <div className='flex w-full justify-center items-center pt-4'>
                <p className='text-gray-500 pr-2'>Need an account?</p>
                <button
                  disabled={isLoading}
                  onClick={navigateToCreateAccount}
                  className='text-sm py-3 rounded-md text-gray-400 hover:text-gray-200'>
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login

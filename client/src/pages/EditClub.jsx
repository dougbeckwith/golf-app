import React from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import axios from 'axios'
import {useState, useEffect} from 'react'

const EditClub = () => {
  const params = useParams()
  const id = params.id
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true)
  const [clubName, setClubName] = useState('')
  const [clubBrand, setClubBrand] = useState('')
  const [nameMessage, setNameMessage] = useState(false)
  const [brandMessage, setBrandMessage] = useState(false)

  // GET club from database
  useEffect(() => {
    const fetchClub = async () => {
      const result = await axios.get(
        `${process.env.REACT_APP_CYCLIC_URL}/api/clubs/${id}`
      )
      setClubName(result.data.clubName)
      setClubBrand(result.data.brand)
      setIsLoading(false)
    }
    fetchClub()
    // eslint-disable-next-line
  }, [])
  // Simple Check to see if input is empty
  const inputValid = (input) => {
    if (input !== '') {
      return true
    } else {
      if (input === clubBrand) {
        setBrandMessage(true)
      }
      if (input === clubName) {
        setNameMessage(true)
      }
      return false
    }
  }

  // UPDATE club in database (update clubName and clubBrand)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (inputValid(clubName) && inputValid(clubBrand)) {
      try {
        await axios.patch(
          `${process.env.REACT_APP_CYCLIC_URL}/api/clubs/${id}`,
          {
            clubName: clubName,
            clubBrand: clubBrand,
          }
        )
        // Reset Input Fields
        setClubName('')
        setClubBrand('')
        navigateToClub()
      } catch (err) {
        console.log(err)
      }
    }
  }

  // Remove error message and update clubName state
  const handleNameChange = (e) => {
    setNameMessage(false)
    setClubName(e.target.value)
  }

  // Remove error message and update clubBrand state
  const handleBrandChange = (e) => {
    setBrandMessage(false)
    setClubBrand(e.target.value)
  }

  // Navigate back to current club page
  const navigateToClub = () => {
    navigate(`/clubs/${id}`)
  }

  return (
    <>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <div className='h-screen bg-dark-500 flex pt-10 sm:pt-24 justify-center text-gray-400'>
          <div className='container max-w-[600px]'>
            <div className='sm:bg-dark-400 border-0 md:border-2 md:border-gray-600 px-3 py-4 md:px-6 md:py-8 sm:rounded-lg w-full'>
              <form>
                <div>
                  <div className='pb-1 pl-1'>
                    <label htmlFor='club' className='text-lg text-gray-400'>
                      Club
                    </label>
                  </div>
                  <input
                    id='club'
                    type='text'
                    onChange={handleNameChange}
                    value={clubName}
                    className='bg-dark-200 placeholder-opacity-60 placeholder-gray-600 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400  focus:ring-blue-400'
                    placeholder='7 Iron'
                  />
                  <p
                    className={
                      nameMessage ? 'text-sm h-4 text-red' : 'invisible h-4'
                    }>
                    Please enter a club.
                  </p>
                </div>
                <div className='pt-2 pb-4'>
                  <div className='pb-2 pl-1'>
                    <label htmlFor='brand' className='text-lg'>
                      Brand
                    </label>
                  </div>
                  <input
                    id='brand'
                    type='text'
                    onChange={handleBrandChange}
                    value={clubBrand}
                    className='bg-dark-200 placeholder-opacity-60 placeholder-gray-600 w-full p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400  focus:ring-blue-400'
                    placeholder='TaylorMade'
                  />
                  <p
                    className={
                      brandMessage ? 'text-sm h-4 text-red' : 'invisible h-4'
                    }>
                    Please enter a brand.
                  </p>
                </div>
                <button
                  onClick={handleSubmit}
                  className='mt-4 w-full bg-blue-400 py-3 rounded-md hover:bg-blue-300'>
                  Submit
                </button>
                <button
                  onClick={navigateToClub}
                  className='mt-4 w-full btn bg-gray-500 text-dark-500 py-3 rounded-md hover:bg-gray-600'>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default EditClub

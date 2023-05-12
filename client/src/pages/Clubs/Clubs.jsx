import {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'
import axios from 'axios'
import ClubItem from './ClubItem'
import ClubList from './ClubList'
import {sortClubsByAvgYards} from '../../helpers'

const Clubs = () => {
  const navigate = useNavigate()

  const [clubData, setClubData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [highestAvgShot, setHighestAvgShot] = useState(0)

  useEffect(() => {
    const getAllClubData = async () => {
      console.log(`${process.env.REACT_APP_CYCLIC_URL}api/clubs`)
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_CYCLIC_URL}api/clubs`
        )
        const data = sortClubsByAvgYards(response.data)
        let highestAvgShot = data[0].avgYards
        setHighestAvgShot(highestAvgShot)
        setClubData(data)
        setIsLoading(false)
      } catch (err) {
        console.log(err)
      }
    }

    getAllClubData()

    // eslint-disable-next-line
  }, [])

  const handleClick = (id) => {
    navigate(`/clubs/${id}`)
  }

  return (
    <>
      <div className='px-5 lg:px-0 lg:pt-7 w-full bg-dark-400 min-h-screen max-h-min'>
        <div className='container m-auto'>
          <div className='pb-10 pt-10'>
            <h1 className='text-gray-500 text-center mx-auto max-w-4xl font-display text-3xl font-medium tracking-tight sm:text-4xl'>
              <span className='text-gray-400'>Welcome</span> to your{' '}
              <span className='relative text-blue-400'>club</span> distance
              overview.{' '}
              <span className='relative whitespace-nowrap text-blue-600 hidden lg:inline-block'>
                {' '}
                Record{' '}
                <span className='hidden lg:inline-block relative text-gray-400'>
                  shots
                </span>
              </span>{' '}
              <span className='hidden lg:inline-block'>
                to track distances.
              </span>
            </h1>
          </div>
          <div className='w-full flex items-center mb-3 '>
            <h1 className='text-gray-400 text-2xl font-semibold'>
              Club Distances
            </h1>
            <div className='ml-auto'>
              <Link to='/clubs/add'>
                <button
                  type='button'
                  className='px-4 py-2 text-sm font-medium rounded-md shadow-sm text-gray-400 bg-blue-400 hover:bg-blue-300 '>
                  Add Club
                </button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div>Loading</div>
          ) : (
            <>
              <ClubList>
                {clubData.map((club) => (
                  <ClubItem
                    key={uuidv4()}
                    club={club}
                    handleClick={handleClick}
                    highestAvgShot={highestAvgShot}
                  />
                ))}
              </ClubList>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Clubs

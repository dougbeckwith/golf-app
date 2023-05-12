import React from 'react'
import axios from 'axios'
import {useParams} from 'react-router-dom'
import {MdOutlineGolfCourse} from 'react-icons/md'

const ShotItem = ({setClub, club, shot}) => {
  const params = useParams()
  const id = params.id

  // UPDATE club remove (shot)
  const deleteShot = async () => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_CYCLIC_URL}/api/clubs/${id}`,

        {
          deleteShot: true,
          shotId: shot.id,
          club: club,
        }
      )
      // Update club state and update avgYards state
      if (response.status === 200) {
        setClub(response.data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <div className='py-2 rounded-md px-2 bg-dark-300'>
        <div className='flex  items-center gap-5'>
          <div>
            <div className='w-[50px] h-[50px]  flex justify-center items-center rounded-md'>
              <MdOutlineGolfCourse size={40} color='#007acc' />
            </div>
          </div>
          <div>
            <p className='text-gray-400 text-sm'>Yards</p>
            <div className='text-blue-400 text-xl font-bold'>
              <span>{shot.yards}</span>
            </div>
          </div>
          <button
            onClick={deleteShot}
            className='h-[40px] px-2 py-1 text-sm font-medium rounded-md shadow-sm text-dark-500 bg-gray-500 hover:bg-red '>
            Delete
          </button>
        </div>
      </div>

      {/*  */}
    </>
  )
}

export default ShotItem

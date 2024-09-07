import React, { useEffect, useState } from 'react'
import Navbar from "../components/Navbar"
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

function SingleImage() {
    const {id}= useParams()
    const [imageUrl,setImageUrl]= useState("")
    const navigate= useNavigate()

    const getImage= async()=>{
        try{

            const data= await axios.get(`${process.env.REACT_APP_API_URL}/images/${id}`)
         
            setImageUrl(data.data.data.post.imagePath)
            

        }
        catch(err){
             console.log(err)
        }
    }

    const deleteImage= async()=>{
        try{

            const data= await axios.delete(`${process.env.REACT_APP_API_URL}/images/${id}`)
         
           if(data)
           {
            alert("Image is deleted successfully")
            navigate("/")
           }
            

        }
        catch(err){
             console.log(err)
        }

    }

    useEffect(()=>{
        getImage()
    },[])

  return (

    <div>


        <Navbar/>
        <div className='sm:mx-14 md:mx-22 xl:mx-32 mt-10'>
            <button onClick={()=>{
                navigate("/")
            }} className='my-4 py-2 px-4 bg-gray-800 text-white font-semibold rounded-xl'>Back</button>
            <button
            onClick={deleteImage}
             className='my-4 py-2 px-4 mx-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl'>
                Delete
            </button>
            <div className=' w-full flex justify-center border rounded-lg'>
            <img src={imageUrl}  alt="image" className='w-full rounded-xl' />
            </div>

        </div>
       
     </div>
  )
}

export default SingleImage
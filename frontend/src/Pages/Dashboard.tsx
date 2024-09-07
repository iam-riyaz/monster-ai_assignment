import React, { useEffect, useState } from 'react'
import { signOut, useSessionContext } from 'supertokens-auth-react/recipe/session';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ImageUploadComponent from '../components/ImageUploadComponent';
import  Navbar  from '../components/Navbar';
import ImageGrid from '../components/ImageGrid';

function Dashboard(props: { userId: string }) {

  const [needReload,setNeedReload]= useState(false)
  let userId = props.userId;
  const navigate= useNavigate()

  const callToSignin= async()=>{

    try{

      const baseurl= `${process.env.REACT_APP_API_URL}/user`
      const user= await axios.post(baseurl,{userId})

      console.log(user.data)

    }
    catch(err){
        console.log(err)
    }

  }
  const handleLogout= async ()=>{
    await signOut();
        navigate("/auth");
  }

  useEffect(()=>{

      callToSignin()
  },[])

  return (
    <div>
      
      <div className='flex flex-col gap-3'>

        <ImageUploadComponent updateNeedReload={()=>setNeedReload((pre)=>!pre)}    userId={userId}/>
        <ImageGrid  needReload={needReload} userId={userId}/>

      </div>
      </div>
  )
}

export default Dashboard
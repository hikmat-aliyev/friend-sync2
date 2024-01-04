import {useState, useEffect} from 'react'
import axios from 'axios';
const API_BASE = 'http://localhost:3000'

function FriendRequests(user) {

  async function getFriendRequests() {
    try{
      const response = await axios.post(`${API_BASE}/friends/requests`, {
          user
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      console.log(response.data)
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    getFriendRequests()
  })

  return(
    <div></div>
  )
}

export default FriendRequests;
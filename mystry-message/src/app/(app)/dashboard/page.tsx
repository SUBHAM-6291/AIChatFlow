/*'use client'
import { Message } from '@/Models/User.Model'
import { zodResolver } from '@hookform/resolvers/zod'
import { Resolver } from 'dns'
import { useSession } from 'next-auth/react'
import {acceptingSchema} from '@/Schema/AcceptMessage.Schema'

import React, { useState } from 'react'
const [message,setmessage]=useState<Message[]>([])
const [isloading,setIsloading]=useState(false)
const [isswitcloading,setisswicthloading]

const page = () => {
  const {toast}=usetoast()
  const handelDeleteMessage=(messageId:string)=>{
    setmessage(MessagesSquare.filter((message)=>message._id!==messageId))
  }

  const {data:session}=useSession()

  const form=useform({
    Resolver:zodResolver(acceptingSchema)
  })
  return (
    <div>
        
    </div>
  )
}

export default page*/
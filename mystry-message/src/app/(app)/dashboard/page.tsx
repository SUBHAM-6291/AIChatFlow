'use client'

import { Message } from '@/Models/User.Model'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { AcceptMessageSchema } from '@/Schema/AcceptMessage.Schema'
import { useForm } from 'react-hook-form'
import { toast, Toaster } from 'sonner'
import React, { useCallback, useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/Types/ApiResponse'
import { Loader2, RefreshCcw } from 'lucide-react'
import MessageCard from '@/components/messageCrad' // Fixed typo

interface User {
  username: string;
}

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
    toast.success("Message deleted successfully")
  }

  const { data: session } = useSession()
  
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema)
  })
  
  const { register, watch, setValue } = form
  const acceptMessages = watch('acceptMessage')

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get('/api/accept-messages')
      setValue('acceptMessage', response.data.isAcceptingMessage)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("error", {
        description: axiosError.response?.data.message || 'failed to fetch message settings'
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      
      if (refresh) {
        toast.success("refreshed messages", {
          description: "showing latest messages"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("error", {
        description: axiosError.response?.data.message || 'failed to fetch messages'
      })
    } finally {
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
  }, [session, fetchAcceptMessage, fetchMessages])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessage', !acceptMessages)
      toast.success(response.data.message || "Settings updated successfully")
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("error", {
        description: axiosError.response?.data.message || 'failed to update message settings'
      })
    }
  }

  if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-lg text-gray-300">Please login</p>
      </div>
    )
  }

  const { username } = session.user as User
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("URL copied", {
      description: "Profile URL has been copied to clipboard"
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-4 mt-8 bg-gray-900 min-h-screen text-gray-100">
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Profile Link</h2>
        <div className="flex items-center space-x-2 mb-6">
          <input
            type="text"
            value={profileUrl}
            readOnly
            className="flex-1 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Copy
          </button>
        </div>

        <div className="flex items-center space-x-3 mb-6">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register('acceptMessage')}
              checked={acceptMessages}
              onChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-gray-800 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-200 after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-200">
              Accept Messages: {acceptMessages ? 'On' : 'Off'}
            </span>
          </label>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault()
            fetchMessages(true)
          }}
          type="button"
          className="flex items-center px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 mb-6"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2 text-gray-200" />
          ) : (
            <RefreshCcw className="w-5 h-5 mr-2 text-gray-200" />
          )}
          {isLoading ? 'Refreshing...' : 'Refresh Messages'}
        </button>

        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p className="text-gray-400 text-center">No messages found</p>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  )
}

export default Page
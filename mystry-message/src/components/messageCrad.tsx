'use client'

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Toaster, toast } from "sonner" // Import both Toaster and toast from sonner
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/Types/ApiResponse'

// Define the Message type
type Message = {
  id: string;
  content?: string;
  title?: string;
}

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message.id}`);
      toast.success(response.data.message || "Message deleted successfully", {
        description: "The message has been removed.",
      });
      onMessageDelete(message.id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message || "Failed to delete message", {
        description: "Something went wrong.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{message.title || 'Card Title'}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive"
                className="text-red-600 hover:text-red-800 transition-colors"
                disabled={isDeleting}
              >
                <span className="w-6 h-5 inline-block">✕</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this message
                  and remove its data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Continue"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>
        <CardContent>
          {message.content || 'Add your card content here'}
        </CardContent>
        <CardFooter>
          {/* Add footer content if needed */}
        </CardFooter>
      </Card>
      <Toaster /> {/* Add Toaster here or in a parent layout */}
    </div>
  )
}

export default MessageCard
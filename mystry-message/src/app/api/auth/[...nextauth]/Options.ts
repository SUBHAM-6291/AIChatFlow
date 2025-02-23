import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbconnect from '@/lib/Db.Connect'
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
  
  providers: [
   
    
  ],
}

export default NextAuth(authOptions)
import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbconnect from "@/lib/Db.Connect";
import { UserModel } from "@/Models/User.Model";


// CHAPTER 1: Type Declarations
// Extending NextAuth's default types to include custom user properties
declare module "next-auth" {
  // 1.1 User Interface Extension
  interface User {
    _id?: string;              // Unique identifier for the user
    isVerified?: boolean;      // Account verification status
    isAcceptingMessage?: boolean; // Message acceptance preference
    username?: string;         // User's chosen username
  }

  // 1.2 Session Interface Extension
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessage?: boolean;
      username?: string;
    } & DefaultSession["user"];  // Merging with default session user properties
  }

  // 1.3 JWT Interface Extension
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
  }
}

// CHAPTER 2: Authentication Configuration
export const authOptions: NextAuthOptions = {
  // 2.1 Authentication Providers
  providers: [
    CredentialsProvider({
      id: "Credentials",         // Unique identifier for this provider
      name: "Credentials",       // Display name for the provider
      
      // 2.1.1 Credential Fields Definition
      credentials: {
        username: { 
          label: "Username", 
          type: "text", 
          placeholder: "jsmith" 
        },
        password: { 
          label: "Password", 
          type: "password" 
        }
      },

      // 2.1.2 Authorization Logic
      async authorize(credentials: any): Promise<any | null> {
        // Database connection
        await dbconnect();
        
        try {
          // 2.1.2.1 User Lookup
          // Search for user by either email or username
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.username },
              { username: credentials.username }
            ]
          });

          // 2.1.2.2 User Existence Check
          if (!user) {
            throw new Error('No user found with this email');
          }

          // 2.1.2.3 Verification Status Check
          if (!user.isVerified) {
            throw new Error('Please verify your account first');
          }

          // 2.1.2.4 Password Validation
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (isPasswordCorrect) {
            return user;  // Return user object on successful authentication
          } else {
            throw new Error('Incorrect password');
          }
        } catch (error: any) {
          // 2.1.2.5 Error Handling
          throw new Error(error.message || "Authentication failed");
        }
      }
    })
  ],

  // CHAPTER 3: Callbacks Configuration
  callbacks: {
    // 3.1 JWT Callback
    // Updates JWT token with user data
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },

    // 3.2 Session Callback
    // Updates session with token data
    async session({ session, token }) {
      if (token) {
        session.user = {
          _id: token._id as string,
          username: token.username as string,
          email: token.email as string,
          isVerified: token.isVerified as boolean,
          isAcceptingMessage: token.isAcceptingMessage as boolean
        };
      }
      return session;
    }
  },

  // CHAPTER 4: Additional Configuration
  // 4.1 Custom Pages
  pages: {
    signIn: '/sign-in',  // Custom sign-in page route
  },

  // 4.2 Session Configuration
  session: {
    strategy: "jwt"      // Using JSON Web Tokens for session management
  },

  // 4.3 Security Configuration
  secret: process.env.NEXTAUTH_SECRET  // Secret key for signing tokens
};

// CHAPTER 5: Export
// Initialize and export NextAuth with configured options
export default NextAuth(authOptions);
import dbConnect from '@/lib/Db.Connect';                   
import { UserModel } from '@/Models/User.Model';             
import { z } from 'zod';                                     
import { usernameValidation } from '@/Schema/Signup.Schema'; 

// Chapter 1: Schema Definition
const verificationSchema = z.object({                      
  username: usernameValidation,                            
  code: z.string().length(6, { message: "Verification code must be 6 digits" })
    .regex(/^\d+$/, { message: "Verification code must contain only digits" }), 
});

// Chapter 2: API Endpoint Setup
export async function POST(request: Request) {             

  // Chapter 3: Database Connection
  await dbConnect();                                       

  // Chapter 4: Request Processing
  try {                                                    
    const { username, code } = await request.json();       
    const decodedUsername = decodeURIComponent(username);  

    // Chapter 5: User Lookup
    const user = await UserModel.findOne({ username: decodedUsername }); 

    if (!user) {                                           
      return Response.json(                                
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }                                    
      );
    }

    // Chapter 6: Verification Logic
    const isCodeValid = user.verifyCode === code;          
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date(); 

    if (isCodeValid && isCodeNotExpired) {                 
      user.isVerified = true;                              
      await user.save();                                   
    } else {                                               
      return Response.json(                                
        {
          success: false,
          message: 'Invalid or expired verification code',
        },
        { status: 400 }                                    
      );
    }

    // Chapter 7: Success Response
    return Response.json(                                  
      {
        success: true,
        message: 'User verified successfully',
        data: user,
      },
      { status: 200 }                                      
    );
  } catch (error) {                                        

    // Chapter 8: Error Handling
    console.log("Error verifying user:", error);           
    return Response.json(                                  
      {
        success: false,
        message: 'Error verifying user',
      },
      { status: 500 }                                      
    );
  }
}
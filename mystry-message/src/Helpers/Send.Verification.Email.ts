import { resend } from '@/lib/Resend';
import VerificationEmail from '../../Emails/Verification.Email'
import { ApiResponse } from '@/Types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
    
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Replace with a verified sender (e.g., Resend domain)
      to: email,
      subject: 'Verify Your Email',
      react: VerificationEmail ({username, otp:verifyCode}) // Fixed syntax
    });
    return {
      success: true,
      message: 'Verification email sent successfully',
    };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return {
      success: false,
      message: 'Failed to send verification email',
    };
  }
}
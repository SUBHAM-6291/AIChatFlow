// emails/VerifyEmail.tsx
import { Html, Head, Container, Heading, Row, Section, Text, Button, Font } from "@react-email/components";

// Define the interface for props
interface VerificationEmailProps {
  username?: string; // Optional username
  otp: string;       // Required OTP (one-time password)
  // Required verification URL (removed from interface)
}

// Default export of the VerificationEmail component
export default function VerificationEmail({ 
  username = "User", 
  otp, 
}: VerificationEmailProps) {
  return (
    <Html>
      {/* Add Head section for custom font */}
      <Head>
        <title>Email Verification</title>
        {/* Example: Importing Google Font (Roboto) */}
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      {/* Body content */}
      <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <Section>
          <Row>
            <Heading style={{ fontFamily: "Roboto, Verdana, sans-serif", fontSize: "24px", color: "#333" }}>
              Welcome{username && `, ${username}`}!
            </Heading>
          </Row>
          <Row>
            <Text style={{ fontFamily: "Roboto, Verdana, sans-serif", fontSize: "16px", color: "#666" }}>
              Thank you for signing up! To verify your email, use the following one-time password (OTP):
            </Text>
          </Row>
          <Row>
            <Text style={{ fontFamily: "Roboto, Verdana, sans-serif", fontSize: "20px", fontWeight: "bold", color: "#007bff" }}>
              OTP: {otp}
            </Text>
          </Row>
        </Section>
      </Container>
    </Html>
  );
}
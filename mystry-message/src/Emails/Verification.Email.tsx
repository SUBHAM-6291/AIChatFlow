// emails/VerifyEmail.tsx
import { Html, Container, Heading, Text, Button } from "@react-email/components";

interface VerifyEmailProps {
  name?: string;
  verificationLink: string; // Required prop for the verification URL
}

const VerifyEmail = ({ name = "User", verificationLink }: VerifyEmailProps) => {
  return (
    <Html>
      <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <Heading style={{ fontSize: "24px", color: "#333" }}>
          Welcome{name && `, ${name}`}!
        </Heading>
        <Text style={{ fontSize: "16px", color: "#666" }}>
          Thank you for signing up! Please verify your email address to get started.
        </Text>
        <Button
          href={verificationLink}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "5px",
            textDecoration: "none",
            fontSize: "16px",
          }}
        >
          Verify Your Email
        </Button>
        <Text style={{ fontSize: "14px", color: "#999", marginTop: "20px" }}>
          If the button doesn’t work, copy and paste this link into your browser:
          <br />
          <a href={verificationLink} style={{ color: "#007bff" }}>
            {verificationLink}
          </a>
        </Text>
      </Container>
    </Html>
  );
};

export default VerifyEmail;
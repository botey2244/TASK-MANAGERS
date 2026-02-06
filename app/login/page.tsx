import AuthLayout from "@/components/AuthLayout"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <AuthLayout
      title="Let’s get started!"
      subtitle="Complete the sign in to access your dashboard."
    >
      <LoginForm />
    </AuthLayout>
  )
}

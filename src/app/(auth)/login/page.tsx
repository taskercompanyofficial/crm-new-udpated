"use client"
import SubmitBtn from "@/components/custom/submit-button"
import { LabelInputContainer } from "@/components/ui/LabelInputContainer"
import useForm from "@/hooks/use-form"
import { LOGIN_CHECK_URL } from "@/lib/apiEndPoints"
import { LogInIcon } from "lucide-react"
import { signIn } from "next-auth/react"
import { toast } from "react-toastify"

export default function Login() {
  const { data, setData, processing, post } = useForm({
    email: "",
    password: "",
  })
  const submitHandler = () => {
    post(LOGIN_CHECK_URL, {
      onSuccess: (response) => {
        toast.promise(signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: true,
          callbackUrl: "/crm"
        }),
          {
            pending: "Credentials being verified...",
            success: "Login successful",
            error: "Login failed"
          }
        )
      },
      onError: (response) => {
        toast.error(response.message)
      }
    })
  }
  return (
    <form className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-white">Login to your account</h1>
        <p className="text-balance text-sm text-gray-200">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-4">
        <LabelInputContainer labelClassName="text-white" label="Email" type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} placeholder="example@domain.com" required />
        <LabelInputContainer labelClassName="text-white" label="Password" type="password" value={data.password} onChange={(e) => setData("password", e.target.value)} placeholder="********" required />
        <SubmitBtn processing={processing} onClick={submitHandler}>
          Login to your account <LogInIcon className="size-4" />
        </SubmitBtn>
      </div>
      <div className="text-center text-sm text-gray-200">
        By continuing, you agree to our{" "}
        <a href="#" className="underline underline-offset-4">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4">
          Privacy Policy
        </a>
      </div>
    </form>
  )
}

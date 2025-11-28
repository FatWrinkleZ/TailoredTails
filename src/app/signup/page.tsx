"use client"
import signUp from "@/firebase/auth/signup"
import type React from "react"
import googleAuth from "@/firebase/auth/googleAuth"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useAuthContext } from "@/context/AuthContext"

function Page() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { user } = useAuthContext() as { user: any }

  useEffect(() => {
    if (user) {
      router.push("/home")
    }
  }, [user, router])

  const handleEmailSignUp = async (event: React.FormEvent) => {
    event.preventDefault()

    const { result, error } = await signUp(email, password)

    if (error) {
      console.error(error)
      return
    }

    console.log("Sign up successful:", result)
    router.push("/home")
  }

  const handleGoogleSignUp = async () => {
    await googleAuth()
  }

  if (user === undefined) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-slate-900">
        <div className="text-slate-900 dark:text-slate-100">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 transition-colors">

      <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg px-8 py-10 max-w-md w-full border border-slate-200 dark:border-slate-700 transition-colors">
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-900 dark:text-white">Sign Up</h1>

        <form onSubmit={handleEmailSignUp} className="space-y-4 mb-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              name="email"
              id="email"
              placeholder="example@mail.com"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="password"
              id="password"
              placeholder="password"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Sign Up
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignUp}
          className="flex items-center justify-center gap-3 w-full border border-slate-300 dark:border-slate-600 font-semibold py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-900 dark:text-slate-100"
        >
          Sign up with Google
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Page
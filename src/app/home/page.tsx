"use client"
import { useAuthContext } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase/config"
import logout from "@/firebase/auth/logout"

function Page() {
  const { user } = useAuthContext() as { user: any }
  const router = useRouter()
  const [embedding, setEmbedding] = useState<number[] | null>(null)
  const [summary, setSummary] = useState<string | null>(null)

  const takeSurvey = () => router.push("/survey")
  const startBrowsing = () => router.push("/match")

  useEffect(() => {
    if (user == null) {
      router.push("/")
      return
    }

    const fetchEmbedding = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          if (data.embedding && Array.isArray(data.embedding) && data.embedding.length === 5) {
            setEmbedding(data.embedding)
          }
        }
      } catch (err) {
        console.error("Failed to load personality data:", err)
      }
    }

    const fetchSummary = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          if (data.summary) {
            setSummary(data.summary)
          }
        }
      } catch (err) {
        console.error("Failed to load personality data:", err)
      }
    }

    fetchEmbedding()
    fetchSummary()
  }, [user, router])

  useEffect(() => {
    const canvas = document.getElementById("personalityChart") as HTMLCanvasElement
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const maxRadius = 140
    const sides = 5

    const labels = ["Cleanliness", "Activity", "Social", "Care Time", "Family"]

    // Check if dark mode is active
    const isDark = document.documentElement.classList.contains('dark')
    
    // Clear canvas with theme-aware background
    ctx.fillStyle = isDark ? "#0f172a" : "#f8fafc"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw guide circles
    ctx.strokeStyle = isDark ? "#334155" : "#cbd5e1"
    ctx.lineWidth = 1
    for (let r = 40; r <= maxRadius; r += 40) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Draw outer pentagon outline
    const outerPoints: { x: number; y: number }[] = []
    ctx.beginPath()
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2
      const x = centerX + maxRadius * Math.cos(angle)
      const y = centerY + maxRadius * Math.sin(angle)
      outerPoints.push({ x, y })
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.strokeStyle = isDark ? "#475569" : "#94a3b8"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw radial lines
    ctx.strokeStyle = isDark ? "#334155" : "#cbd5e1"
    ctx.lineWidth = 1
    outerPoints.forEach(p => {
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
    })

    // Draw inner filled pentagon based on embedding
    if (embedding) {
      ctx.beginPath()
      embedding.forEach((value, i) => {
        const angle = (i * 2 * Math.PI) / sides - Math.PI / 2
        const radius = maxRadius * value
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)

        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.closePath()

      // Fill with gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius)
      gradient.addColorStop(0, "rgba(34, 197, 94, 0.8)")
      gradient.addColorStop(1, "rgba(34, 197, 94, 0.2)")

      ctx.fillStyle = gradient
      ctx.fill()

      ctx.strokeStyle = "#22c55e"
      ctx.lineWidth = 3
      ctx.stroke()
    }

    // Labels
    ctx.font = "bold 15px Inter, system-ui, sans-serif"
    ctx.fillStyle = isDark ? "#e2e8f0" : "#475569"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    outerPoints.forEach((p, i) => {
      const textRadius = maxRadius + 38
      const angle = Math.atan2(p.y - centerY, p.x - centerX)
      const textX = centerX + textRadius * Math.cos(angle)
      const textY = centerY + textRadius * Math.sin(angle)

      ctx.save()
      ctx.translate(textX, textY)
      ctx.rotate(angle + Math.PI / 2)
      ctx.fillText(labels[i], 0, 0)
      ctx.restore()
    })

    // Center message
    if (!embedding) {
      ctx.font = "18px Inter, system-ui, sans-serif"
      ctx.fillStyle = isDark ? "#64748b" : "#94a3b8"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("No Personality Data Yet", centerX, centerY)
    } else {
      ctx.font = "bold 16px Inter"
      ctx.fillStyle = "#22c55e"
      ctx.fillText("Your Profile", centerX, centerY)
    }

  }, [user, router, embedding])

  const handleLogout = async () => {
    const { error } = await logout()
    if (error) {
      console.error("Logout error:", error)
      return
    }
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-12 px-6 transition-colors">
      <div className="max-w-6xl mx-auto">


        <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
          Welcome back! Your personality profile is ready.
        </p>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <button
              onClick={takeSurvey}
              className="w-full bg-blue-600 text-white text-xl font-bold py-5 rounded-xl hover:bg-blue-500 transition-all duration-300 shadow-xl transform hover:scale-[1.02]"
            >
              {embedding ? "Retake Survey" : "Take Personality Survey"}
            </button>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-2xl transition-colors">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Your Personality Radar</h2>
              <div className="flex justify-center">
                <canvas
                  id="personalityChart"
                  width="420"
                  height="420"
                  className="rounded-2xl shadow-inner"
                  style={{ imageRendering: "crisp-edges" }}
                />
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-6">Summary: {summary}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 transition-colors">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              {embedding ? "Ready for Matches!" : "Complete Survey First"}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {embedding
                ? "Your personality profile is complete! Browse dogs that match your lifestyle."
                : "Take the survey to unlock personalized dog recommendations."}
            </p>
            {embedding && (
              <button 
                className="mt-6 w-full bg-emerald-600 text-white py-4 rounded-lg font-bold hover:bg-emerald-500 transition" 
                onClick={startBrowsing}
              >
                Browse My Matches
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
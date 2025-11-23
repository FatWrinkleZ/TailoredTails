"use client"
import { useAuthContext } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import logout from "@/firebase/auth/logout"

function Page() {
  const { user } = useAuthContext() as { user: any }
  const router = useRouter()

  useEffect(() => {
    if (user == null) {
      router.push("/")
    }

    const labels = ["Cleanliness", "Relaxed", "Extraversion", "Independence", "Family"]

    const canvas = document.getElementById("personalityChart") as HTMLCanvasElement
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    // Background
    ctx.fillStyle = "#111111"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = 140
    const sides = 5

    const points: { x: number; y: number; label: string }[] = []

    // Draw concentric guide circles (subtle)
    ctx.strokeStyle = "#333333"
    ctx.lineWidth = 1
    for (let r = 40; r <= radius; r += 40) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Draw pentagon outline
    ctx.beginPath()
    for (let i = 0; i <= sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      points.push({ x, y, label: labels[i % labels.length] })

      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.strokeStyle = "#444444"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw radial lines from center to vertices
    ctx.strokeStyle = "#333333"
    ctx.lineWidth = 1
    points.forEach(p => {
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
    })

    // Labels
    ctx.font = "bold 15px Inter, system-ui, sans-serif"
    ctx.fillStyle = "#e2e8f0"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    points.forEach(p => {
      const textRadius = radius + 38
      const angle = Math.atan2(p.y - centerY, p.x - centerX)
      const textX = centerX + textRadius * Math.cos(angle)
      const textY = centerY + textRadius * Math.sin(angle)

      ctx.save()
      ctx.translate(textX, textY)
      const rotate = angle + Math.PI / 2
      ctx.rotate(rotate)
      ctx.fillText(p.label, 0, 0)
      ctx.restore()
    })

    // Center message
    ctx.font = "18px Inter, system-ui, sans-serif"
    ctx.fillStyle = "#64748b"
    ctx.fillText("No Personality Data Yet", centerX, centerY)

  }, [user, router])

  const handleLogout = async () => {
    const { error } = await logout()
    if (error) {
      console.error("Logout error:", error)
      return
    }
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-white">My Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-7 py-3 rounded-lg font-semibold hover:bg-red-500 transition-all duration-200 shadow-lg"
          >
            Logout
          </button>
        </div>

        <p className="text-gray-400 text-lg mb-10">
          Welcome back! Complete your personality survey to find your perfect dog match.
        </p>

        {/* CTA + Chart */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <button className="w-full bg-blue-600 text-white text-xl font-bold py-5 rounded-xl hover:bg-blue-500 transition-all duration-300 shadow-xl transform hover:scale-[1.02]">
              Take Personality Survey
            </button>

            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-6">Your Personality Radar</h2>
              <div className="flex justify-center">
                <canvas
                  id="personalityChart"
                  width="420"
                  height="420"
                  className="rounded-2xl bg-gray-950 shadow-inner"
                  style={{ imageRendering: "crisp-edges" }}
                />
              </div>
            </div>
          </div>

          {/* Optional: Add future stats or matches here */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">Browse Matches (Coming Soon)</h3>
            <p className="text-gray-400">
              Once you complete the survey, you can browse dogs best fit for you!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
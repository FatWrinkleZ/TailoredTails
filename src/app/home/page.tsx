"use client"
import { useAuthContext } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import logout from "@/firebase/auth/logout"

function Page() {
  const { user } = useAuthContext() as { user: any }
  const router = useRouter()

  useEffect(() => {
    // Redirect to the home page if the user is not logged in
    if (user == null) {
      router.push("/")
    }

    const labels = [
      "Cleanliness",
      "Relaxed",
      "Extraversion",
      "Time",
      "Family"
    ];

    const canvas = document.getElementById("personalityChart") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#3f3c3cff"; // light gray
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw a regular pentagon in the center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 150; // distance from center to vertex
      const sides = 5;

      const points = [];
      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const angle = (i * 2 * Math.PI) / sides - Math.PI / 2; // start from top
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        points.push({ x, y, label: labels[i] });

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();

      // Style the pentagon
      ctx.fillStyle = "#727272ff";   // nice blue fill
      ctx.strokeStyle = "#ffffffff"; // dark blue border
      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();

      ctx.font = "14px Arial";
      ctx.fillStyle = "#ffffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      points.forEach(point => {
        if (!point.label) return;
        // Offset text slightly outside the vertex
        const textRadius = radius + 25;
        const angle = Math.atan2(point.y - centerY, point.x - centerX);
        const textX = centerX + textRadius * Math.cos(angle);
        const textY = centerY + textRadius * Math.sin(angle);

        ctx.save();
        ctx.translate(textX, textY);

        // Rotate text to follow radial direction
        //const rotateAngle = angle + (angle > Math.PI / 2 || angle < -Math.PI / 2 ? Math.PI : 0);
        //ctx.rotate(rotateAngle);

        ctx.fillText(point.label, 0, 0);
        ctx.restore();

      });
    ctx.font = "14px Arial";
      ctx.fillStyle = "#ffffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("No Personality Data Yet", centerX, centerY);
    }

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
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Home</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
      <p>Only logged-in users can view this page</p>
      <div className="my-6">
        <button
          className="bg-blue-500 text-white px-6 py-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Take Personality Survey
        </button>
        <h2 className="text-2xl font-bold  my-3">Personality Breakdown</h2>
        <canvas id="personalityChart" width="400" height="400" style={{ borderRadius: "30px" }}></canvas>
      </div>
    </div>
  )
}

export default Page

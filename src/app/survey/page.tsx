"use client";
import React, { useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation"
import { db } from "@/firebase/config"; // your firebase config
import firebase_app from "@/firebase/config";
import { getAuth } from "firebase/auth";

function Page() {
  // Store array of responses with full question info
    const auth = getAuth(firebase_app);
    const router = useRouter();


  const [responses, setResponses] = useState<
    { id: string; text: string; value: number }[]
  >([]);

  const questions = [
    { id: "outdoor_time", text: "How much time do you spend outdoors?" },
    { id: "exercise", text: "How active is your lifestyle?" },
    { id: "home_time", text: "How much time do you spend at home during the day?" },
    { id: "noise_tolerance", text: "How tolerant are you of noise?" },
    { id: "cleanliness", text: "How important is cleanliness to you?" },
    { id: "experience", text: "How experienced are you with dogs?" },
    { id: "patience", text: "How patient are you with training?" },
    { id: "social", text: "How social is your lifestyle?" },
    { id: "space", text: "How much living space do you have?" },
    { id: "grooming", text: "How much time can you dedicate to grooming?" },
    { id: "budget", text: "What's your budget level for dog care?" },
  ];

  const handleChange = (questionId: string, value: number) => {
    const question = questions.find(q => q.id === questionId)!;
        setResponses(prev => {
        // Remove existing response for this question (if any)
        const filtered = prev.filter(r => r.id !== questionId);
        // Add new response
        return [...filtered, { id: questionId, text: question.text, value }];
        });
    };

    const getResponseValue = (questionId: string) => {
        return responses.find(r => r.id === questionId)?.value;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) return alert("Please sign in first!");

        try {
            const res = await fetch("/api/recommend", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(responses), 
            });
            if (!res.ok) throw new Error("AI failed");

            const result = await res.json();

            await setDoc(doc(db, "users", user.uid), {
            embedding: result.embedding,
            summary: result.summary,
            updatedAt: new Date(),
            }, { merge: true });

            //alert(result.summary);
            router.push("/home");
        } catch (err) {
            console.error(err);
            alert("Something went wrong!");
        }
    };

  const handleClear = () => {
    setResponses([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Lifestyle Survey</h1>
        <p className="text-slate-400 mb-8">
          Rate each question from 1 (low) to 10 (high)
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6"
            >
              <label className="block mb-4">
                <span className="text-lg font-semibold">
                  {index + 1}. {question.text}
                </span>
              </label>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleChange(question.id, value)}
                      className={`
                        w-12 h-12 rounded-lg font-semibold transition-all
                        ${
                          getResponseValue(question.id) === value
                            ? "bg-emerald-500 text-slate-950 scale-110"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }
                      `}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              {getResponseValue(question.id) !== undefined && (
                <p className="mt-3 text-sm text-emerald-400">
                  Selected: {getResponseValue(question.id)}
                </p>
              )}
            </div>
          ))}

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 transition font-semibold text-slate-950"
            >
              Submit Survey
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-3 rounded-lg border border-slate-600 hover:border-slate-400 text-slate-100"
            >
              Clear All
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Page;
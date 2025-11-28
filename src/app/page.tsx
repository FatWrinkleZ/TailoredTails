"use client";
import type React from "react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useAuthContext } from "@/context/AuthContext"

export default function Home() {
    const router = useRouter()
    const { user } = useAuthContext() as { user: any }

    var validLogin = false;
  
    useEffect(() => {
      if (user) {
        validLogin=true;
      }
    }, [user]);

    const handleStartMatching = () => {
      if (validLogin) {
        router.push("/match");
      } else {
        router.push("/signin");
      }
    };

    const handleSignIn = () => {
      if (validLogin) {
        router.push("/home");
      } else 
      {
        router.push("/signin");
      }
    };

    const handleSignUp = () => {
      if (validLogin) {
        router.push("/home");
      } else {
        router.push("/signup");
      }
    };

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors">
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col gap-12 py-10">
        {/* Top badge */}
        <section className="mt-4 space-y-6">
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-emerald-600 dark:text-emerald-300 uppercase">
            TailoredTails
            <span className="inline-block h-1 w-1 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            <span className="text-slate-500 dark:text-slate-400">Capstone Project</span>
          </p>

          {/* Hero */}
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div className="flex-1 space-y-5">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-slate-900 dark:text-slate-50">
                Find the <span className="text-emerald-500 dark:text-emerald-400">right dog</span> for{" "}
                <span className="text-emerald-600 dark:text-emerald-300">your lifestyle</span>.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl">
                TailoredTails matches adopters with dogs from nearby shelters based
                on lifestyle, schedule, and preferences. The goal is to reduce
                failed adoptions and help both people and dogs find better fits.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 transition font-semibold text-white" onClick={handleStartMatching}>
                  Start Matching
                </button>

                <button className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-400 text-slate-900 dark:text-slate-100 text-sm flex items-center justify-center gap-2 transition-colors" onClick={handleSignUp}>
                  Create Account
                </button>
                <button className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-400 text-slate-900 dark:text-slate-100 text-sm flex items-center justify-center gap-2 transition-colors" onClick={handleSignIn}>
                  Sign In
                </button>
              </div>

              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 space-y-1">
                <p>• Uses real shelter data (e.g., Miami-Dade).</p>
                <p>• Matches based on lifestyle, not just appearance.</p>
                <p>• Built as a full-stack CS capstone project.</p>
              </div>
            </div>

            {/* Simple preview card */}
            <div className="flex-1 w-full max-w-md">
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg shadow-emerald-500/10 space-y-4 transition-colors">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Sample Match Preview
                  </h2>
                  <span className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-1 rounded-full">
                    Example (not real)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-2xl">
                    🐶
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Luna • 2 yrs • Medium
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Energetic, apartment-friendly, and good for people with a
                      busy work schedule.
                    </p>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-emerald-500 dark:bg-emerald-400" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Match score: <span className="font-semibold">82%</span> based on
                  lifestyle, routine, and activity level.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-50">
            How TailoredTails works
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 transition-colors">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                1. You answer questions
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Share your schedule, home setup, experience with dogs, and what
                you're looking for in a companion.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 transition-colors">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                2. We process shelter data
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Dog profiles from shelters are standardized so we can compare them
                fairly against your lifestyle.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 transition-colors">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                3. You get tailored matches
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                We surface dogs that fit your situation and explain why each one
                might be a good match.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 transition-colors">
          <div className="flex-1 space-y-2">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-50">
              Built as a capstone, designed for real adopters.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              TailoredTails is an early prototype, but the goal is real: help
              people and dogs find better matches and give shelters a smarter way
              to present their animals.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold text-white">
              View Demo Flow
            </button>
            <button className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs sm:text-sm text-slate-900 dark:text-slate-100 transition-colors">
              See Shelter Integration Plan
            </button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 py-4 mt-8 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} TailoredTails · Capstone Project
          </p>
          <p className="text-xs text-slate-500">
            Built by our team to help people find the right dogs—not just any
            dogs.
          </p>
        </div>
      </footer>
    </main>
  );
}
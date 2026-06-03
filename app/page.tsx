'use client'

import Link from 'next/link'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {/* Left Side - Welcome Content */}
        <div className="flex-1 text-center lg:text-left">
          <div className="cozy-card-static p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-4 text-balance">
              🥬 Welcome to ShelfLife
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty">
              Keep your shared pantry fresh and waste-free.
            </p>
            
            {/* Illustration Area */}
            <div className="bg-background border-3 border-foreground rounded-2xl p-6 md:p-8">
              <div className="grid grid-cols-4 gap-4 text-4xl md:text-5xl">
                <div className="cozy-card-static p-4 flex items-center justify-center">🥛</div>
                <div className="cozy-card-static p-4 flex items-center justify-center">🍞</div>
                <div className="cozy-card-static p-4 flex items-center justify-center">🥚</div>
                <div className="cozy-card-static p-4 flex items-center justify-center">🍎</div>
                <div className="cozy-card-static p-4 flex items-center justify-center">🥩</div>
                <div className="cozy-card-static p-4 flex items-center justify-center">🧀</div>
                <div className="cozy-card-static p-4 flex items-center justify-center">🥕</div>
                <div className="cozy-card-static p-4 flex items-center justify-center">🍇</div>
              </div>
              <p className="text-center text-muted-foreground mt-4 font-semibold">
                Track everything on your shelves!
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Buttons */}
        <div className="w-full lg:w-auto flex-shrink-0">
          <div className="cozy-card-static p-8 md:p-10 w-full lg:w-80">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🏠</div>
              <h2 className="text-2xl font-bold text-foreground">
                Join Your Household
              </h2>
              <p className="text-muted-foreground mt-2">
                Start managing groceries together
              </p>
            </div>

            <div className="space-y-4">
              <Link 
                href="/login/signin"
                className="cozy-btn w-full block text-center text-lg"
              >
                Sign In
              </Link>
              
              <Link 
                href="/login/signup"
                className="cozy-btn-secondary w-full block text-center text-lg"
              >
                Create Account
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t-3 border-foreground">
              <p className="text-sm text-center text-muted-foreground">
                🌱 Join <span className="font-bold">2,431</span> households already reducing food waste!
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-navy-500 mb-4">
          CountryScore v2.0
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Real country reviews from real people
        </p>
        
        <div className="bg-white rounded-card shadow-card p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-primary-500 mb-4">
            React + Vite + Tailwind
          </h2>
          <p className="text-gray-600 mb-6">
            Project setup complete! Ready to build.
          </p>
          
          <button
            onClick={() => setCount((count) => count + 1)}
            className="bg-gradient-to-b from-success-400 to-success-500 hover:from-success-500 hover:to-success-600 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            Count: {count}
          </button>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>✅ Tailwind CSS configured</p>
            <p>✅ Custom color palette loaded</p>
            <p>✅ Ready for Commit 2</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
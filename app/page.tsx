import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Stellar DeFi Analytics 📊
        </h1>
        
        <p className="text-xl text-center mb-12">
          Open-source analytics dashboard for Stellar DeFi protocols
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 border border-gray-300 rounded-lg hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-2">Protocol Overview</h2>
            <p className="text-gray-600">
              Track TVL, volumes, and key metrics across all Stellar DeFi protocols
            </p>
          </div>

          <div className="p-6 border border-gray-300 rounded-lg hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-2">Liquidity Pools</h2>
            <p className="text-gray-600">
              Monitor liquidity pools, APYs, and LP positions in real-time
            </p>
          </div>

          <div className="p-6 border border-gray-300 rounded-lg hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-2">Portfolio Tracking</h2>
            <p className="text-gray-600">
              Track your DeFi positions and earnings across multiple protocols
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Launch Dashboard
          </Link>
        </div>

        <div className="mt-16 text-center text-sm text-gray-500">
          <p>Made with ❤️ by HyperDevTools</p>
          <p className="mt-2">
            <a
              href="https://github.com/HyperDevTools/stellar-defi-analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

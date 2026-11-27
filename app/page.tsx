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

        <p className="text-center text-gray-600 mb-8">
          Inspect the assets, reserves and issued shares of Stellar liquidity pools using Horizon
          ledger data.
        </p>

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

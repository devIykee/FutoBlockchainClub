/** @type {import('next').NextConfig} */
const nextConfig = {
  // android/arm64 (Termux/PRoot) has no native SWC binary — use WASM first locally
  experimental: {
    useWasmBinary: true,
  },
  async redirects() {
    return [
      { source: "/signup", destination: "/ledger-contest/signup", permanent: true },
      {
        source: "/thank-you",
        destination: "/ledger-contest/thank-you",
        permanent: true,
      },
      {
        source: "/leaderboard",
        destination: "/ledger-contest/leaderboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

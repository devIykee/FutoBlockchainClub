/** @type {import('next').NextConfig} */
const nextConfig = {
  // android/arm64 (Termux/PRoot) has no native SWC binary — use WASM first
  experimental: {
    useWasmBinary: true,
  },
};

export default nextConfig;

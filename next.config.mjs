/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   experimental: {
//     appDir: true,
//   },
// }

// export default nextConfig
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    proxyTimeout: 120000,
  },
  
  async rewrites() {
    return [
      {
        source: "/v-apiserver/:slug*",
        // destination: "http://203.163.250.57:3000/v-apiserver/:slug*",
        // destination: "http://122.176.27.132:9800/v-apiserver/:slug*",
        destination:
          process.env.NEXT_PUBLIC_BACKEND_URL + "/v-apiserver/:slug*",
      },
      {
        source: "/stream/itms/live/:slug*",
        // destination: "http://203.163.250.57:3000/stream/itms/live/:slug*",
        // destination: "http://122.176.27.132:9800/stream/itms/live/:slug*",
        destination:
          process.env.NEXT_PUBLIC_BACKEND_URL + "/stream/itms/live/:slug*",
      },
      {
        source: "/v-notificationserver/:slug*",
        // destination: "http://203.163.250.57:3000/v-notificationserver/:slug*",

        // destination: "http://122.176.27.132:9800/v-notificationserver/:slug*",
        destination:
          process.env.NEXT_PUBLIC_BACKEND_URL + "/v-notificationserver/:slug*",
      },
      {
        source: "/stream/itms/archive/:slug*",
        // destination: "http://203.163.250.57:3000/stream/itms/archive/:slug*",
        // destination: "http://122.176.27.132:9800/stream/itms/archive/:slug*",
        destination:
          process.env.NEXT_PUBLIC_BACKEND_URL + "/stream/itms/archive/:slug*",
      },
    ]
  },
}

export default nextConfig

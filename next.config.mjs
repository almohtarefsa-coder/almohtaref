/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['unique-timing-044438.framer.app'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
    // Allow images from API routes
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.cdnfonts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.cdnfonts.com",
              "font-src 'self' data: https://fonts.gstatic.com https://fonts.cdnfonts.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://fonts.googleapis.com https://fonts.cdnfonts.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-src 'self'",
              "object-src 'none'",
              "require-trusted-types-for 'script'; report-uri /api/csp-report",
            ].join('; '),
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;





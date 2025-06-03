const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  // Usamos CSP frame-ancestors en lugar de X-Frame-Options
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
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self' https://*.supabase.co",
      "frame-ancestors 'self' *",
      "form-action 'self'",
    ].join('; ')
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Habilitar Server Actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Mejorar la compatibilidad
    esmExternals: true,
  },
  // Mover paquetes externos al nivel superior
  serverExternalPackages: ['@supabase/supabase-js'],
  // Configuración de imágenes
  images: {
    domains: [
      'localhost',
      '*.supabase.co',
      'source.unsplash.com',
      'api.unsplash.com',
      'hcegmotvdidgavvacgcy.supabase.co'
    ]
  },
  async headers() {
    return [
      {
        // Aplicar a todas las rutas
        source: '/(.*)',
        headers: securityHeaders.filter(header => header.key !== 'Content-Security-Policy'),
      },
      // CSP se maneja por separado para mejor compatibilidad
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: securityHeaders.find(h => h.key === 'Content-Security-Policy')?.value || '',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

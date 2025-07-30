import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="AI-powered content optimization tool that analyzes your social media posts and provides algorithmic compatibility scores, engagement predictions, and optimization suggestions before you publish."
        />
        <meta
          name="keywords"
          content="AI content optimization, social media analytics, post performance prediction, Twitter analytics, Instagram engagement, Facebook optimization, LinkedIn content"
        />
        <meta name="author" content="PostOptima AI" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph / Facebook */}
        <meta
          property="og:title"
          content="PostOptima AI - Know Your Post's Performance Before It Goes Live"
        />
        <meta
          property="og:description"
          content="Revolutionary AI tool that predicts social media post performance across Twitter, Instagram, Facebook, and LinkedIn before you publish."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://postoptima.com" />
        <meta property="og:site_name" content="PostOptima AI" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@postoptima" />
        <meta name="twitter:creator" content="@postoptima" />
        <meta
          name="twitter:title"
          content="PostOptima AI - Predict Social Media Performance"
        />
        <meta
          name="twitter:description"
          content="AI-powered predictions for Twitter, Instagram, Facebook, LinkedIn posts before you publish."
        />

        {/* Canonical */}
        <link rel="canonical" href="https://postoptima.com" />

        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* <link rel="preconnect" href="https://pagead2.googlesyndication.com" /> */}

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9516790941040153"
          crossOrigin="anonymous"
        ></script>

        {/* Structured Data */}
        {/* <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "PostOptima AI",
              description:
                "AI-powered social media content optimization tool that predicts post performance before you publish",
              url: "https://postoptima.com",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Organization",
                name: "PostOptima AI",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "150",
              },
            }),
          }}
        /> */}

        {/* Organization Schema */}
        {/* <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "PostOptima AI",
              url: "https://postoptima.com",
              logo: "https://postoptima.com/logo.png",
              sameAs: [
                "https://twitter.com/postoptima",
                "https://linkedin.com/company/postoptima",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                email: "hello@postoptima.com",
              },
            }),
          }}
        /> */}
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

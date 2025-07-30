import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>
          PostOptima AI - Predict Social Media Performance Before You Post
        </title>
        <meta
          name="description"
          content="AI-powered content optimization tool that analyzes your social media posts and provides algorithmic compatibility scores, engagement predictions, and optimization suggestions before you publish."
        />
        <meta
          name="keywords"
          content="AI content optimization, social media analytics, post performance prediction, Twitter analytics, Instagram engagement, Facebook optimization, LinkedIn content"
        />
        <meta
          property="og:title"
          content="PostOptima AI - Know Your Post's Performance Before It Goes Live"
        />
        <meta
          property="og:description"
          content="Revolutionary AI tool that predicts social media post performance across Twitter, Instagram, Facebook, and LinkedIn before you publish."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="PostOptima AI - Predict Social Media Performance"
        />
        <meta
          name="twitter:description"
          content="AI-powered predictions for Twitter, Instagram, Facebook, LinkedIn posts before you publish."
        />
        <link rel="canonical" href="https://postoptima.com" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9516790941040153"
          crossorigin="anonymous"
        ></script>
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

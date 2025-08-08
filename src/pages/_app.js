import "@/styles/globals.css";
import Head from "next/head";
import Header from "@/components/Header";
import { AuthProvider } from "@/lib/authContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

import "@/src/styles/globals.css";
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../chakra/theme';
import Layout from "../components/Layout/Layout";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot >
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </RecoilRoot >
  );
}

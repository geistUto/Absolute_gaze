import React,{useEffect,useState} from 'react'
import {Layout} from '../components'
import 'tailwindcss/tailwind.css'
import '../styles/globals.scss'
import Head from 'next/head'
import { SnippetsProvider } from '../context/SnippetsContext';
import { KnowledgeGraphProvider } from '../context/KnowledgeGraphContext';
function MyApp({ Component, pageProps }) {
  return (
    <>
    <Head>
        <title>DIALECTONIC</title>
        <link rel="icon" href="/eye-full.svg" />
      </Head>
  <Layout>
    <SnippetsProvider>
      <KnowledgeGraphProvider>
        <Component {...pageProps} />
      </KnowledgeGraphProvider>
    </SnippetsProvider>
  </Layout>
  </>
  )
}

export default MyApp

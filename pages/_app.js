import React,{useEffect,useState} from 'react'
import {Layout} from '../components'
import 'tailwindcss/tailwind.css'
import '../styles/globals.scss'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
    <Head>
        <title>Absolute gaze</title>
        <link rel="icon" href="/eye-full.svg" />
      </Head>
  <Layout>
  <Component {...pageProps} />
  </Layout>
  </>
  )
}

export default MyApp

import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/snippets');
    }
  }, [router]);

  const handleSignUp = () => {
    router.push('/auth'); 
  };

  return (
    <div className="container mx-auto px-10 mb-8 p-4">
      <Head>
        <title>Dialectonic</title>
        <link rel="icon" href="/eye-full.svg" />
      </Head>
      
      <div className="intro-note mb-8 text-center bg-gray-800 p-6 rounded-lg bg-opacity-50 shadow-lg">
  <h2 className="text-3xl text-yellow-300 font-bold mb-4">Unlock Your Cognitive Potential!</h2>
  <h3 className="text-xl text-white mb-2">Welcome, Intrepid Explorer!</h3>
  <p className="text-white mb-4">
    We’re thrilled to have you aboard on this journey through the vast seas of knowledge! At <strong>Dialectonic</strong>, 
    we’re not just navigating the waves of information; we’re charting new territories where your thoughts can thrive.
  </p>
  <p className="text-white mb-4">
    In a world overflowing with information, finding clarity is essential. We empower you to harness 
    <strong> contextual search</strong> to effortlessly engage with what truly matters.
  </p>
  <p className="text-white mb-4">
    Our innovative <strong>Text Tension Analysis</strong> not only enhances your writing but also helps you distill your thoughts 
    into impactful narratives. With our tools, you can effectively <strong>organize media consumption</strong>, ensuring that the content 
    you engage with enriches your mind.
  </p>
  <p className="text-white mb-4">
    Experience the power of <strong>automated realm prediction</strong>, allowing for personalized categorization of your insights. 
    Watch as your ideas form a unique <strong>knowledge graph</strong> that evolves with your understanding. 
    Sign up now to unlock the full potential of your mind snippets, and let’s transform your ideas into impactful narratives together!
  </p>
        <button 
          onClick={handleSignUp} 
          className="mt-6 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Sign Up
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
        <div className='lg:col-span-9 col-span-1'>
          {/* Placeholder for Articles content */}
          <h2 className='text-xl font-bold mb-4'>Articles</h2>
          <p>Your insightful articles are just a click away! Explore various topics and expand your knowledge.</p>
        </div>
        <div className='lg:col-span-3 col-span-1'>
          <div className='lg:sticky relative top-8'>
            {/* <PostWidget />
            <Categories /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

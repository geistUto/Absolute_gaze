import Head from 'next/head'
import { Categories, PostCard, PostWidget } from '../components'
import {getPosts} from '../services'
import { FeaturedPosts } from '../sections'



export default function Home({posts}) {
  return (
    <div className="container mx-auto px-10 mb-8">
      <Head>
        <title>Absolute gaze</title>
        <link rel="icon" href="/eye-full.svg" />
      </Head>
      <FeaturedPosts />
    <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
      <div className='lg:col-span-9 col-span-1'>
        {posts.map((post)=><PostCard post={post.node} key={post.title} />)}
      </div>
      <div className='lg:col-span-3 col-span-1'>
        <div className='lg:sticky relative top-8'>
         <PostWidget />
         <Categories />
        </div>
      </div>
    </div>
    </div>
  )
}

export async function getStaticProps(){
  const posts = (await getPosts()) || [];
  
  return {
    props:{posts}
  }
}
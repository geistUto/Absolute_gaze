import React from 'react'
import Image from 'next/image'


const Author = ({author}) => (
        <div className="text-center mt-15 mb-8 p-8 relative rounded-lg bg-white bg-opacity-20">
          <div classname="absolute left-0 right-0 -top-35">
          <Image unoptimized alt={author.name} src={author.photo.url} height='100px' width='100px' className='align-middle rounded-full' /> 
          </div>
          <h3 className='text-white mt-4 mb-4 text-xl font-bold'>{author.name}</h3>
          <p className='text-white text-ls'>{author.bio}</p> 
        </div>
    )


export default Author

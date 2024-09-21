import { graphql } from 'graphql';
import {request,gql} from 'graphql-request';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

export const getPosts = async()=>{
    const query = gql`
      query MyQuery {
  postsConnection {
    edges {
      node {
        author {
          bio
          name
          id
          photo {
            url
          }
        }
        createdAt
        slug
        title
        excerpt
        featuredImage {
          url
        }
        categories {
          name
          slug
        }
      }
    }
  }
}
`
    const result=await request(graphqlAPI,query);

    return result.postsConnection.edges;

}

export const getPostDetails = async(slug)=>{
  const query = gql`
    query getPostDetails($slug: String!) {
      post(where: {slug: $slug}){
      author {
        bio
        name
        photo {
          url
        }
      }
      createdAt
      slug
      title
      excerpt
      featuredImage {
        url
      }
      categories {
        name
        slug
      }
      content{
        raw
      }
    }
  }
`
  const result=await request(graphqlAPI,query,{ slug });

  return result.post;

}

export const getRecentPosts = async () => {
  const query = gql`
    query GetRecentPosts {
      posts(orderBy: createdAt_DESC, first: 5) {
        title
        slug
        createdAt
        featuredImage {
          url
        }
      }
    }
  `;

  try {
    const result = await request(graphqlAPI, query);
    return result.posts;
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    throw new Error('Failed to fetch recent posts');
  }
};

export const getSimilarPosts = async(categories,slug)=>{
  const query = gql`
   query getPostDetails($slug:String!,$categories:[String!]){
     posts(where:{
       slug_not:$slug, AND:{categories_some:{slug_in:$categories}}}
       last:3
       )
          
           {title
            featuredImage{
              url
            }
          createdAt
          slug}
   }`
   const result= await request(graphqlAPI,query,{categories,slug});
   return result.posts
}

export const getCategoryPost = async (slug) => {
  const query = gql`
    query getCategoryPost($slug: String!) {
      postsConnection(where: {categories_some: {slug: $slug}}) {
        edges {
          cursor
          node {
            author {
              bio
              name
              id
              photo {
                url
              }
            }
            createdAt
            slug
            title
            excerpt
            featuredImage {
              url
            }
            categories {
              name
              slug
            }
          }
        }
      }
    }
  `;
  console.log('Generated query:', query);
  try {
    const result = await request(graphqlAPI, query, { slug });
    return result.postsConnection.edges;
  } catch (error) {
    console.error('Error fetching category posts:', error);
    throw new Error('Failed to fetch category posts');
  }
};


export const getCategories = async()=>{
  const query = gql`
   query getCategories{
         categories{
            name
            slug}
   }`
   const result= await request(graphqlAPI,query)
   return result.categories
}

export const getFeaturedPosts = async () => {
  const query = gql`
    query GetFeaturedPosts {
      posts(where: {featuredPost: true}) {
        author {
          name
          photo {
            url
          }
        }
        featuredImage {
          url
        }
        title
        slug
        createdAt
      }
    }   
  `;

  const result = await request(graphqlAPI, query);
  return result.posts;
};

export const submitComment = async(obj)=>{
  const result = await fetch('/api/comments',
  {method:'POST',
  headers:{'Content-Type':'application/json'},
  body:JSON.stringify(obj),})
  return result.json()
}

export const getComments = async(slug)=>{
  const query = gql`
   query getComments($slug:String!){
         comments(where:{post:{slug:$slug}}){
            name
            createdAt
            comment
            }
   }`
   const result= await request(graphqlAPI,query,{slug})
   return result.comments;
}
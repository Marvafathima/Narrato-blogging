import React from 'react'
import Layout from './Layout'
import UserPostsGrid from './UserPostGrid'
import { fetchUserBlogs } from '../app/slice/authSlice'
import { useSelector,useDispatch } from 'react-redux'
import { Spinner } from '@material-tailwind/react'
import { useEffect } from 'react'
export const UserPostGridPage = () => {

  const dispatch = useDispatch();
  const { userBlogs, blogloading, blogerror } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(fetchUserBlogs());
  }, [dispatch]);
  

  if(blogloading){
    return(
        <div className="flex items-center justify-center h-screen">
        <Spinner className="h-16 w-16 text-deep_orange-500" />
      </div>
    )
  }
  if (blogerror) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {blogerror}</p>
        <button 
          onClick={() => dispatch(fetchUserBlogs())}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
   <Layout>
<UserPostsGrid posts={userBlogs}></UserPostsGrid>
   </Layout>
  )
}

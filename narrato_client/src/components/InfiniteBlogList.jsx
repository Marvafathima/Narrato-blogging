import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Avatar 
} from "@material-tailwind/react";
import { 
  Heart, 
  MessageCircle, 
  MoreVertical 
} from 'lucide-react';
import { fetchBlogs, resetBlogState } from '../app/slice/blogSlice'; // Adjust import path as needed
import Layout from './Layout';


const BlogCardSkeleton = () => (
  <Card className="animate-pulse mb-4">
    <div className="flex items-center p-4">
      <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
      <div className="flex-grow">
        <div className="h-4 bg-gray-300 mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-300 w-1/2"></div>
      </div>
    </div>
    <div className="h-64 bg-gray-200"></div>
  </Card>
);

const InfiniteBlogList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // State for pagination
  const [page, setPage] = useState(1);
  
  // Destructure with default values to handle initial state
  const { 
    blogs = [], 
    loading = false, 
    error = null,
    pagination 
  } = useSelector(state => state.blog);

  // Ref for intersection observer
  const observerRef = useRef();
  const lastBlogElementRef = useCallback(node => {
    // If loading or no more blogs, do nothing
    if (loading || !pagination?.next) return;
    
    // Disconnect previous observer
    if (observerRef.current) observerRef.current.disconnect();
    
    // Create new observer
    observerRef.current = new IntersectionObserver(entries => {
      // If last element is visible and there are more blogs, load more
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    });

    // Observe the last element if it exists
    if (node) observerRef.current.observe(node);
  }, [loading, pagination]);

  // Effect to fetch initial blogs or when page changes
  useEffect(() => {
    // Reset state when component mounts for the first time
    if (page === 1) {
      dispatch(resetBlogState());
    }

    // Fetch blogs
    dispatch(fetchBlogs({ 
      page, 
      pageSize: 10 
    }));
  }, [page, dispatch]);

  // Handler for navigating to blog detail
  const handleBlogClick = (post) => {
    navigate('/blog-detail', { state: { post } });
  };

  // Render error state
  if (error) {
    return (
      <Layout>
        <div className="text-center text-red-500 p-4">
          Failed to load blogs. Please try again later.
          <button 
            onClick={() => {
              setPage(1);
              dispatch(fetchBlogs({ page: 1, pageSize: 10 }));
            }} 
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
        {/* Debugging log */}
        {blogs.length === 0 && !loading && (
          <div className="text-center text-gray-500 p-4">
            No blogs found. Check your data source.
          </div>
        )}

        {blogs.map((post, index) => {
          // Check if this is the last element to attach ref
          const isLastElement = blogs.length === index + 1;
          
          return (
            <div 
              key={post.id}
              ref={isLastElement ? lastBlogElementRef : null}
              onClick={() => handleBlogClick(post)}
              className="cursor-pointer mb-4"
            >
              <Card className="w-full">
                {/* Blog Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar
                      size="sm"
                      src={post.user?.profile_pic || `/api/placeholder/40/40`}
                      alt={post.user?.username || 'Unknown User'}
                    />
                    <div>
                      <Typography variant="h6">
                        {post.user?.username || 'Unknown User'}
                      </Typography>
                      <Typography variant="small" color="gray" className="font-normal">
                        {new Date(post.created_at).toLocaleDateString()}
                      </Typography>
                    </div>
                  </div>
                  {/* <MoreVertical className="h-5 w-5 text-gray-500" /> */}
                </div>

                {/* Blog Image */}
                <div className="aspect-square">
                  <img
                    src={post.post_images?.[0]?.post_image || `/api/placeholder/600/600`}
                    alt={post.title || 'Blog Post'}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Blog Interactions */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <Heart className="h-6 w-6 text-gray-500" />
                      <MessageCircle className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                  
                  <Typography variant="small" className="font-bold mb-2">
                    {post.likes || 0} likes
                  </Typography>
                  
                  <Typography variant="small">
                    <span className="font-bold">{post.user?.username || 'Unknown'}</span> {post.description}
                  </Typography>
                </div>
              </Card>
            </div>
          );
        })}

        {/* Loading state */}
        {loading && (
          <>
            <BlogCardSkeleton />
            <BlogCardSkeleton />
          </>
        )}

        {/* No more blogs */}
        {!loading && !pagination?.next && (
          <div className="text-center text-gray-500 p-4">
            No more blogs to load
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InfiniteBlogList;
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Card, 
//   Typography, 
//   Avatar 
// } from "@material-tailwind/react";
// import { 
//   Heart, 
//   MessageCircle, 
//   MoreVertical 
// } from 'lucide-react';
// import { fetchBlogs } from '../app/slice/blogSlice';// Adjust import path as needed
// import Layout from './Layout';

// // Placeholder for loading skeleton
// const BlogCardSkeleton = () => (
//   <Card className="animate-pulse mb-4">
//     <div className="flex items-center p-4">
//       <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
//       <div className="flex-grow">
//         <div className="h-4 bg-gray-300 mb-2 w-3/4"></div>
//         <div className="h-4 bg-gray-300 w-1/2"></div>
//       </div>
//     </div>
//     <div className="h-64 bg-gray-200"></div>
//   </Card>
// );

// const InfiniteBlogList = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   // State for blogs and pagination
//   const [page, setPage] = useState(1);
//   const { 
//     blogs, 
//     hasMore, 
//     loading, 
//     error 
//   } = useSelector(state => state.blog);

//   // Ref for intersection observer
//   const observerRef = useRef();
//   const lastBlogElementRef = useCallback(node => {
//     // If loading, do nothing
//     if (loading) return;
    
//     // Disconnect previous observer
//     if (observerRef.current) observerRef.current.disconnect();
    
//     // Create new observer
//     observerRef.current = new IntersectionObserver(entries => {
//       // If last element is visible and there are more blogs, load more
//       if (entries[0].isIntersecting && hasMore) {
//         setPage(prevPage => prevPage + 1);
//       }
//     });

//     // Observe the last element if it exists
//     if (node) observerRef.current.observe(node);
//   }, [loading, hasMore]);

//   // Fetch blogs when component mounts or page changes
//   useEffect(() => {
//  dispatch(fetchBlogs({ page }));
//   }, [page, dispatch]);

//   // Handler for navigating to blog detail
//   const handleBlogClick = (post) => {
//     navigate('/blog-detail', { state: { post } });
//   };
// if (error){
//     console.log("oru error",error)
// }
//   // Render error state
//   if (error) {
//     return (
//       <Layout>
//         <div className="text-center text-red-500 p-4">
            
//           Failed to load blogs. Please try again later.
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="max-w-4xl mx-auto px-4">
//         {blogs.map((post, index) => {
//           // Check if this is the last element to attach ref
//           const isLastElement = blogs.length === index + 1;
          
//           return (
//             <div 
//               key={post.id}
//               ref={isLastElement ? lastBlogElementRef : null}
//               onClick={() => handleBlogClick(post)}
//               className="cursor-pointer mb-4"
//             >
//               <Card className="w-full">
//                 {/* Blog Header */}
//                 <div className="flex items-center justify-between p-4 border-b">
//                   <div className="flex items-center gap-3">
//                     <Avatar
//                       size="sm"
//                       src={post.user.profile_pic || `/api/placeholder/40/40`}
//                       alt={post.user.username}
//                     />
//                     <div>
//                       <Typography variant="h6">{post.user.username}</Typography>
//                       <Typography variant="small" color="gray" className="font-normal">
//                         {new Date(post.created_at).toLocaleDateString()}
//                       </Typography>
//                     </div>
//                   </div>
//                   <MoreVertical className="h-5 w-5 text-gray-500" />
//                 </div>

//                 {/* Blog Image */}
//                 <div className="aspect-square">
//                   <img
//                     src={post.post_images[0]?.post_image || `/api/placeholder/600/600`}
//                     alt={post.title}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 {/* Blog Interactions */}
//                 <div className="p-4">
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="flex items-center gap-4">
//                       <Heart className="h-6 w-6 text-gray-500" />
//                       <MessageCircle className="h-6 w-6 text-gray-500" />
//                     </div>
//                   </div>
                  
//                   <Typography variant="small" className="font-bold mb-2">
//                     {post.likes} likes
//                   </Typography>
                  
//                   <Typography variant="small">
//                     <span className="font-bold">{post.user.username}</span> {post.description}
//                   </Typography>
//                 </div>
//               </Card>
//             </div>
//           );
//         })}

//         {/* Loading state */}
//         {loading && (
//           <>
//             <BlogCardSkeleton />
//             <BlogCardSkeleton />
//           </>
//         )}

//         {/* No more blogs */}
//         {!hasMore && !loading && (
//           <div className="text-center text-gray-500 p-4">
//             No more blogs to load
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default InfiniteBlogList;
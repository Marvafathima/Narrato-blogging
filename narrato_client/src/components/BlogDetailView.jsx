import React, { useState } from 'react';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { editBlogPost,deleteBlogPost } from '../app/slice/authSlice';
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  MoreVertical, 
  Trash, 
  Edit2,
  MessageCircle,
  Bookmark
} from 'lucide-react';
import {
  Card,
  Typography,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar
} from "@material-tailwind/react";
import Layout from './Layout';
import Swal from 'sweetalert2';
import EditBlogDialog from './EditBlogDialog';
import { toast } from 'react-toastify';
const BlogDetailView = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const location = useLocation();
  const post = location.state?.post;

  if (!post) {
    return <div>No post data found</div>; 
  }

  const isAuthor = user?.id === post.user.id;
  const images = post.post_images || [];
  const hasMultipleImages = images.length > 1;
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  const handleEditSubmit = async (formData) => {
        try {
   
      const result = await dispatch(editBlogPost({ formData, blogId: post.id })).unwrap();
  
      // Check response from API
      if (result) {
        toast.success(result.message || "Blog updated successfully");
        navigate('/my-blog'); // Redirect after successful update
      }
    } catch (error) {
      // Handle API errors
      if (error?.status === 400) {
        toast.error("Validation error: Please check the input fields.");
      } else if (error?.status === 404) {
        toast.error("Blog not found or unauthorized.");
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error('Error updating post:', error);
    }
  };
//   
// const handleEditSubmit = async (formData) => {
//     try {
//       // Dispatch the edit action
//       console.log(formData)
  
   
//       const result = await dispatch(editBlogPost({ formData, blogId: post.id })).unwrap();
  
//       // Check response from API
//       if (result) {
//         toast.success(result.message || "Blog updated successfully");
//         navigate('/my-blog'); // Redirect after successful update
//       }
//     } catch (error) {
//       // Handle API errors
//       if (error?.status === 400) {
//         toast.error("Validation error: Please check the input fields.");
//       } else if (error?.status === 404) {
//         toast.error("Blog not found or unauthorized.");
//       } else {
//         toast.error("An unexpected error occurred.");
//       }
//       console.error('Error updating post:', error);
//     }
//   };
  
  const handleDeletePost = async (blogId) => {
    try {
      // SweetAlert confirmation
      const { isConfirmed } = await Swal.fire({
        title: 'Are you sure?',
        text: "This action cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });
  
      if (isConfirmed) {
        // Dispatch the delete action
        const result = await dispatch(deleteBlogPost(blogId)).unwrap();
  
        // Check response from API
        if (result) {
          toast.success(result.message || "Blog deleted successfully");
          navigate('/my-blog')
        }
      }
    } catch (error) {
      // Handle API errors
      if (error?.status === 404) {
        toast.error("Blog not found or unauthorized.");
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error('Error deleting post:', error);
    }
  };

  const formatPostDate = (date) => {
    return format(new Date(date), 'MMMM d, yyyy');
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <Card className="flex flex-col md:flex-row w-full bg-white">
          {/* Left side - Image Section */}
          <div className="md:w-3/5 relative aspect-square">
            <img
              src={images[currentImageIndex]?.post_image || `/api/placeholder/600/600`}
              alt={`${post.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {hasMultipleImages && (
              <>
                <IconButton
                  variant="text"
                  color="white"
                  size="sm"
                  onClick={handlePrevImage}
                  className="!absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full hover:bg-black/70"
                >
                  <ChevronLeft className="h-6 w-6" />
                </IconButton>
                <IconButton
                  variant="text"
                  color="white"
                  size="sm"
                  onClick={handleNextImage}
                  className="!absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full hover:bg-black/70"
                >
                  <ChevronRight className="h-6 w-6" />
                </IconButton>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full">
                  <Typography variant="small">
                    {currentImageIndex + 1} / {images.length}
                  </Typography>
                </div>
              </>
            )}
          </div>

          {/* Right side - Content Section */}
          <div className="md:w-2/5 flex flex-col">
            {/* Header with user info */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar
                  size="sm"
                  src={post.user.profile_pic || `/api/placeholder/40/40`}
                  alt={post.user.username}
                />
                <div>
                  <Typography variant="h6">{post.user.username}</Typography>
                  <Typography variant="small" color="gray" className="font-normal">
                    {formatPostDate(post.created_at)}
                  </Typography>
                </div>
              </div>
              
              {isAuthor && (
                <Menu placement="bottom-end">
                  <MenuHandler>
                    <IconButton variant="text" color="gray">
                      <MoreVertical className="h-5 w-5" />
                    </IconButton>
                  </MenuHandler>
                 <MenuList>
                 <MenuItem
                     onClick={() => setOpenEditDialog(true)}
                     className="flex items-center gap-2"
                      >
                    <Edit2 className="h-4 w-4" />
                    <Typography variant="small">Edit Post</Typography>
                </MenuItem>
                                {/* <MenuItem className="flex items-center gap-2">
                      <Edit2 className="h-4 w-4" />
                      <Typography variant="small">Edit Post</Typography>
                    </MenuItem> */}
                    <MenuItem 
                      onClick={() => handleDeletePost(post.id)} 
                    className="flex items-center gap-2 text-red-500">
                      <Trash className="h-4 w-4" />
                      <Typography variant="small">Delete Post</Typography>
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
            </div>

            {/* Description and content */}
            <div className="flex-grow overflow-y-auto p-4">
              <Typography variant="h5" color="blue-gray" className="mb-2">
                {post.title}
              </Typography>
              <Typography className="whitespace-pre-line mb-4">
                {post.description}
              </Typography>

              <div className="flex flex-wrap gap-2 mb-4">
                {post.hashtags.map((tag) => (
                  <Typography
                    key={tag.id}
                    variant="small"
                    color="blue"
                    className="cursor-pointer hover:text-blue-700"
                  >
                    #{tag.name}
                  </Typography>
                ))}
              </div>
            </div>

            {/* Interaction buttons */}
            <div className="p-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <IconButton variant="text" className="hover:text-red-500">
                    <Heart className="h-6 w-6" />
                  </IconButton>
                  <IconButton variant="text">
                    <MessageCircle className="h-6 w-6" />
                  </IconButton>
                </div>
                <IconButton variant="text">
                  <Bookmark className="h-6 w-6" />
                </IconButton>
              </div>
              
              <Typography variant="small" className="font-bold mb-2">
                {post.likes} likes
              </Typography>

              {/* Comments section */}
              <div className="border-t pt-4">
                <Typography variant="small" color="gray">
                  Comments section can be implemented here
                </Typography>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <EditBlogDialog
  open={openEditDialog}
  handler={() => setOpenEditDialog(false)}
  post={post}
  onSubmit={handleEditSubmit}
/>
    </Layout>
  );
};

export default BlogDetailView;
// import React, { useState } from 'react';
// import { format } from 'date-fns';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { 
//   ChevronLeft, 
//   ChevronRight, 
//   Heart, 
//   MoreVertical, 
//   Trash, 
//   Edit2,
//   X 
// } from 'lucide-react';
// import {
//   Card,
//   CardHeader,
//   CardBody,
//   CardFooter,
//   Typography,
//   IconButton,
//   Menu,
//   MenuHandler,
//   MenuList,
//   MenuItem,
//   Avatar
// } from "@material-tailwind/react";
// import { useLocation } from 'react-router-dom';
// import Layout from './Layout';

// const BlogDetailView = () => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user } = useSelector(state => state.auth);
//   const location = useLocation();
//   const post = location.state?.post;

//   if (!post) {
//     return <div>No post data found</div>; 
//   }

//   const isAuthor = user?.id === post.user.id;
//   const images = post.post_images || [];
//   const hasMultipleImages = images.length > 1;

//   const handlePrevImage = () => {
//     setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
//   };

//   const handleNextImage = () => {
//     setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
//   };

//   const formatPostDate = (date) => {
//     return format(new Date(date), 'MMMM d, yyyy');
//   };

//   return (
//     <Layout>
       
//     <Card className="max-w-2xl w-full bg-white shadow-xl">
//       {/* Header */}
//       <CardHeader floated={false} shadow={false} className="rounded-none">
//         <div className="flex items-center justify-between p-4">
//           <div className="flex items-center gap-3">
//             <Avatar
//               size="sm"
//               src={post.user.profile_pic || `/api/placeholder/40/40`}
//               alt={post.user.username}
//             />
//             <div>
//               <Typography variant="h6">{post.user.username}</Typography>
//               <Typography variant="small" color="gray" className="font-normal">
//                 {formatPostDate(post.created_at)}
//               </Typography>
//             </div>
//           </div>
          
//           {isAuthor && (
//             <Menu placement="bottom-end">
//               <MenuHandler>
//                 <IconButton variant="text" color="gray">
//                   <MoreVertical className="h-5 w-5" />
//                 </IconButton>
//               </MenuHandler>
//               <MenuList>
//                 <MenuItem
//                 //   onClick={onEdit}
//                   className="flex items-center gap-2"
//                 >
//                   <Edit2 className="h-4 w-4" />
//                   <Typography variant="small">Edit Post</Typography>
//                 </MenuItem>
//                 <MenuItem
//                 //   onClick={onDelete}
//                   className="flex items-center gap-2 text-red-500"
//                 >
//                   <Trash className="h-4 w-4" />
//                   <Typography variant="small">Delete Post</Typography>
//                 </MenuItem>
//               </MenuList>
//             </Menu>
//           )}
//         </div>
//       </CardHeader>

//       {/* Image Carousel */}
//       <div className="relative aspect-square">
//         <img
//           src={images[currentImageIndex]?.post_image || `/api/placeholder/600/600`}
//           alt={`${post.title} - Image ${currentImageIndex + 1}`}
//           className="w-full h-full object-cover"
//         />
        
//         {hasMultipleImages && (
//           <>
//             <IconButton
//               variant="text"
//               color="white"
//               size="sm"
//               onClick={handlePrevImage}
//               className="!absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full hover:bg-black/70"
//             >
//               <ChevronLeft className="h-6 w-6" />
//             </IconButton>
//             <IconButton
//               variant="text"
//               color="white"
//               size="sm"
//               onClick={handleNextImage}
//               className="!absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full hover:bg-black/70"
//             >
//               <ChevronRight className="h-6 w-6" />
//             </IconButton>
            
//             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full">
//               <Typography variant="small">
//                 {currentImageIndex + 1} / {images.length}
//               </Typography>
//             </div>
//           </>
//         )}
//       </div>

//       <CardBody>
//         <Typography variant="h5" color="blue-gray" className="mb-2">
//           {post.title}
//         </Typography>
//         <Typography className="whitespace-pre-line mb-4">
//           {post.description}
//         </Typography>

//         <div className="flex flex-wrap gap-2 mb-4">
//           {post.hashtags.map((tag) => (
//             <Typography
//               key={tag.id}
//               variant="small"
//               color="blue"
//               className="cursor-pointer hover:text-blue-700"
//             >
//               #{tag.name}
//             </Typography>
//           ))}
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-1">
//             <Heart className="h-5 w-5" />
//             <Typography variant="small">{post.likes}</Typography>
//           </div>
//         </div>
//       </CardBody>

//       <CardFooter className="pt-3">
//         <Typography variant="small" color="gray">
//           Comments section can be implemented here
//         </Typography>
//       </CardFooter>
//     </Card></Layout>
//   );
// };

// export default BlogDetailView;

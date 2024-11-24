

import React, { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Chip,
  Spinner
} from "@material-tailwind/react";
import { Camera, Edit, Plus, X, Hash } from 'lucide-react';
import ReactCrop from 'react-image-crop';
import Layout from './Layout';
import { createBlogPost,fetchUserDetails, selectAuthError, selectAuthLoading, selectUserDetails } from '../app/slice/authSlice';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-image-crop/dist/ReactCrop.css';
import { useNavigate } from 'react-router-dom';
const UserProfile = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector(selectUserDetails);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const navigate=useNavigate();
  const [posts, setPosts] = useState([]);
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [newPost, setNewPost] = useState({
    images: [],
    hashtags: [],
    description: '',
    currentEditIndex: null
  });
  const [hashtagInput, setHashtagInput] = useState('');

  const handleHashtagInput = (e) => {
    if (e.key === 'Enter' && hashtagInput.trim()) {
      e.preventDefault();
      // Remove # if included and lowercase
      const tag = hashtagInput.trim().replace('#', '').toLowerCase();
      
      if (tag && !newPost.hashtags.includes(tag)) {
        setNewPost(prev => ({
          ...prev,
          hashtags: [...prev.hashtags, tag]
        }));
      }
      setHashtagInput('');
    }
  };

  const removeHashtag = (tagToRemove) => {
    setNewPost(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Image editing states
  const [crop, setCrop] = useState();
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [editMode, setEditMode] = useState(false);
  
  useEffect(() => {
    if (!userDetails) {
      dispatch(fetchUserDetails());
    }
  }, [dispatch, userDetails]);

  const handleOpenPostDialog = () => {
    setOpenPostDialog(!openPostDialog);
    if (!openPostDialog) {
      // Reset states when opening dialog
      setNewPost({ 
        images: [], 
        hashtags: [], 
        description: '', 
        currentEditIndex: null 
      });
      setEditMode(false);
      setCrop(undefined);
      setRotation(0);
      setScale(1);
    }
  };
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Cleanup any existing object URLs first
    newPost.images.forEach(image => {
      if (image.preview) {
        URL.revokeObjectURL(image.preview);
      }
    });
    
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      edited: false
    }));
  
    setNewPost(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };
  // const handleImageUpload = (e) => {
  //   const files = Array.from(e.target.files);
  //   const newImages = files.map(file => ({
  //     file,
  //     preview: URL.createObjectURL(file),
  //     edited: false
  //   }));

  //   setNewPost(prev => ({
  //     ...prev,
  //     images: [...prev.images, ...newImages]
  //   }));
  // };

  const handleEditImage = (index) => {
    setNewPost(prev => ({
      ...prev,
      currentEditIndex: index
    }));
    setEditMode(true);
    setRotation(0);
    setScale(1);
    setCrop(undefined);
  };

  const handleRemoveImage = (index) => {
    setNewPost(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

//   const handleSaveEdit = () => {
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     const image = document.querySelector('.crop-image');
  
//     if (!image || !crop) return;
  
//     canvas.width = crop.width;
//     canvas.height = crop.height;
  
//     // ... your existing transform code ...
//     ctx.save();
//     ctx.translate(canvas.width / 2, canvas.height / 2);
//     ctx.rotate((rotation * Math.PI) / 180);
//     ctx.scale(scale, scale);
//     ctx.translate(-canvas.width / 2, -canvas.height / 2);
    
//     ctx.drawImage(
//       image,
//       crop.x,
//       crop.y,
//       crop.width,
//       crop.height,
//       0,
//       0,
//       crop.width,
//       crop.height
//     );
    
//     ctx.restore();

   
    
//     // Convert the canvas to a Blob instead of a data URL
//     canvas.toBlob((blob) => {
//       const editedFile = new File([blob], 'edited-image.jpg', { type: 'image/jpeg' });
//       const editedPreview = URL.createObjectURL(blob);
      
//       setNewPost(prev => ({
//         ...prev,
//         images: prev.images.map((img, idx) => 
//           idx === prev.currentEditIndex 
//             ? {
//                 file: editedFile, // Save the edited file
//                 preview: editedPreview,
//                 edited: true
//               }
//             : img
//         ),
//         currentEditIndex: null
//       }));
//     }, 'image/jpeg');
    
//     setEditMode(false);
//   };

// // Add cleanup on unmount
// useEffect(() => {
//   return () => {
//     // Cleanup object URLs when component unmounts
//     newPost.images.forEach(image => {
//       if (image.preview) {
//         URL.revokeObjectURL(image.preview);
//       }
//     });
//   };
// }, [newPost.images]);

const handleSaveEdit = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const image = document.querySelector('.crop-image');

  if (!image || !crop) return;

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(scale, scale);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);
  
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );
  
  ctx.restore();

  const editedImageUrl = canvas.toDataURL('image/jpeg');
  
  setNewPost(prev => ({
    ...prev,
    images: prev.images.map((img, idx) => 
      idx === prev.currentEditIndex 
        ? { ...img, preview: editedImageUrl, edited: true }
        : img
    ),
    currentEditIndex: null
  }));
  
  setEditMode(false);
};
const handlePostSubmit = async () => {
  if (!newPost.images.length) {
    console.error('No images selected');
    return;
  }
  
  if (!newPost.description.trim()) {
    console.error('Description is required');
    return;
  }
  
  const formData = new FormData();
  try {
    formData.append('title', newPost.description.split('\n')[0]);
    formData.append('description', newPost.description);
    
    newPost.images.forEach((img, index) => {
      if (!img.file) {
        throw new Error(`Missing file for image at index ${index}`);
      }
      formData.append(`images[${index}]`, img.file);
    });
    
    formData.append('hashtags', JSON.stringify(newPost.hashtags));
    for (let pair of formData.entries()) {
      console.log("form data in form",pair[0], pair[1]); // This will show the actual content
    }


    try {
      const result = await dispatch(createBlogPost(formData)).unwrap(); // Unwraps the result or throws an error
      toast.success("New post created successfully!");
      console.log("Post created:", result);
      navigate("/my-blog")
      
    } catch (error) {
      console.error("Error creating post:", error); // Log the error for debugging
      toast.error("Error creating post. Please try again.");
    }
    // Add your API call here
    // await postData(formData);
    
    setNewPost({ 
      images: [], 
      description: '', 
      hashtags: [], 
      currentEditIndex: null 
    });
    setOpenPostDialog(false);
  } catch (error) {
    console.error('Error submitting post:', error);
  }
};


  

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
    <Spinner className="h-16 w-16 text-deep_orange-500" />
  </div>
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
        <button 
          onClick={() => dispatch(fetchUserDetails())}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-4xl">
        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar 
                src={userDetails?.profile_pic} 
                alt="Profile" 
                size="xxl"
                className="border-4 border-deep_orange-400"
              />
              <button className="absolute bottom-0 right-0 bg-ocean_green-50 text-white rounded-full p-1">
                <Camera size={16} />
              </button>
            </div>
            
            <div className="text-center md:text-left">
              <Typography variant="h4">{userDetails?.username}</Typography>
              <Typography variant="paragraph" color="gray">
                {userDetails?.email}
              </Typography>
              <div className="flex gap-4 mt-2 justify-center md:justify-start">
                <Button 
                  size="sm" 
                  variant="outlined" 
                  className="flex items-center gap-2"
                  color="teal"
                >
                  <Edit size={16} /> Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Posts Section */}
        <div className="mb-6 flex justify-between items-center">
          <Typography variant="h5">My Posts</Typography>
          <Button 
            onClick={handleOpenPostDialog}
            className="flex items-center gap-2"
            color="teal"
          >
            <Plus size={16} /> Add Post
          </Button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div 
              key={post.id} 
              className="relative group overflow-hidden rounded-lg cursor-pointer"
            >
              <img 
                src={post.images[0]} 
                alt="Post"
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white p-2 transition-opacity duration-300">
                <Typography color="white" variant="small">
                  {post.description}
                </Typography>
              </div>
            </div>
          ))}
        </div>

        {/* Add Post Dialog */}
        <Dialog 
          open={openPostDialog} 
          handler={handleOpenPostDialog}
          size="lg"
        >
          <DialogHeader>Create New Post</DialogHeader>
          <DialogBody divider>
            <div className="space-y-4">
              {!editMode && (
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="w-full "
                  multiple
                />
              )}

              {editMode && newPost.currentEditIndex !== null ? (
                <div className="space-y-4">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    aspect={16 / 9}
                  >
                    <img
                      src={newPost.images[newPost.currentEditIndex].preview}
                      alt="Edit"
                      className="crop-image w-full h-64 object-contain"
                      style={{
                        transform: `rotate(${rotation}deg) scale(${scale})`,
                        transition: 'transform 0.2s'
                      }}
                    />
                  </ReactCrop>
                  
                  <div className="flex gap-4 justify-center">
                    <Button
                    variant='outlined'
                      size="sm"
                      onClick={() => setRotation(r => (r + 90) % 360)}
                      className='text-deep_orange-500 border-deep_orange-500 hover:border-deep-orange-800'
                    >
                      Rotate
                    </Button>
                    <Button
                    variant='outlined'
                      size="sm"
                      onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}
                      className='text-deep_orange-500 border-deep_orange-500'
                    >
                      Zoom Out
                    </Button>
                    <Button
                    variant='outlined'
                      size="sm"
                      onClick={() => setScale(s => Math.min(s + 0.1, 3))}
                      className='text-deep_orange-500 border-deep_orange-500'
                    >
                      Zoom In
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={handleSaveEdit}
                    className="w-full animate-pulse "
                    color="teal"
                  >
                    Apply Changes
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {newPost.images.map((img, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={img.preview} 
                        alt={`Preview ${index}`} 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => handleEditImage(index)}
                          className="p-1 bg-white rounded-full shadow-md"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="p-1 bg-white rounded-full shadow-md"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <textarea 
                placeholder="Write a description..."
                value={newPost.description}
                onChange={(e) => setNewPost(prev => ({...prev, description: e.target.value}))}
                className="w-full p-2 border rounded-lg"
                rows={4}
              />

              {/* Hashtag Input */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Hash size={16} className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="Add hashtags (press Enter)"
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    onKeyPress={handleHashtagInput}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                
                {/* Hashtag Display */}
                <div className="flex flex-wrap gap-2">
                  {newPost.hashtags?.map((tag, index) => (
                    <Chip
                      key={index}
                      value={`#${tag}`}
                      onClose={() => removeHashtag(tag)}
                      color="teal"
                      className="bg-teal-500"
                    />
                  ))}
                </div>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button 
              variant="text" 
              color="red" 
              onClick={handleOpenPostDialog}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button 
              color="teal"
              onClick={handlePostSubmit}
              disabled={newPost.images.length === 0 || !newPost.description || editMode}
            >
              Post
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </Layout>
  );
};

export default UserProfile;

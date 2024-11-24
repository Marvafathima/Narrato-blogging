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
import { fetchUserDetails, selectAuthError, selectAuthLoading, selectUserDetails } from '../app/slice/authSlice';
import { useSelector, useDispatch } from 'react-redux';

import 'react-image-crop/dist/ReactCrop.css';

const UserProfile = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector(selectUserDetails);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  const [posts, setPosts] = useState([]);
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [newPost, setNewPost] = useState({
    images: [],
    hashtags: [],
    description: '',
    currentEditIndex: null
  });
  const [hashtagInput, setHashtagInput] = useState('');

  // Debug logging for newPost state changes
  useEffect(() => {
    console.log('newPost state updated:', newPost);
  }, [newPost]);

  const handleHashtagInput = (e) => {
    if (e.key === 'Enter' && hashtagInput.trim()) {
      e.preventDefault();
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
    if (files.length === 0) return;

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      edited: false
    }));

    setNewPost(prev => {
      const updatedPost = {
        ...prev,
        images: [...prev.images, ...newImages]
      };
      console.log('Updated images:', updatedPost.images);
      return updatedPost;
    });
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setNewPost(prev => {
      const updatedPost = {
        ...prev,
        description: value
      };
      console.log('Updated description:', updatedPost.description);
      return updatedPost;
    });
  };

  const handlePostSubmit = async () => {
    try {
      console.log('Submitting post with state:', newPost);
      
      if (!newPost.images.length || !newPost.description) {
        console.error('Missing required fields:', {
          hasImages: newPost.images.length > 0,
          hasDescription: Boolean(newPost.description)
        });
        return;
      }

      const formData = new FormData();
      formData.append('title', newPost.description.split('\n')[0]);
      formData.append('description', newPost.description);
      
      newPost.images.forEach((img, index) => {
        if (img.file) {
          formData.append(`images[${index}]`, img.file);
          console.log(`Appended image ${index}:`, img.file);
        }
      });
      
      formData.append('hashtags', JSON.stringify(newPost.hashtags));

      // Log FormData contents
      for (let pair of formData.entries()) {
        console.log('FormData entry:', pair[0], pair[1]);
      }

      // Here you would send formData to your backend
      
      setNewPost({ 
        images: [], 
        description: '', 
        hashtags: [], 
        currentEditIndex: null 
      });
      setOpenPostDialog(false);
    } catch (error) {
      console.error('Error in handlePostSubmit:', error);
    }
  };

  // Rest of the component remains the same until the return statement

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Profile Header */}
        <Card className="p-4 sm:p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
            <div className="relative w-24 sm:w-32 md:w-40">
              <Avatar 
                src={userDetails?.profile_pic} 
                alt="Profile" 
                size="xxl"
                className="w-full h-full border-4 border-deep_orange-400"
              />
              <button className="absolute bottom-0 right-0 bg-ocean_green-50 text-white rounded-full p-1">
                <Camera size={16} />
              </button>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <Typography variant="h4" className="text-xl sm:text-2xl md:text-3xl">
                {userDetails?.username}
              </Typography>
              <Typography variant="paragraph" color="gray" className="text-sm sm:text-base">
                {userDetails?.email}
              </Typography>
              <div className="flex gap-2 sm:gap-4 mt-2 justify-center md:justify-start">
                <Button 
                  size="sm" 
                  variant="outlined" 
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                  color="teal"
                >
                  <Edit size={14} /> Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Posts Section */}
        <div className="mb-4 sm:mb-6 flex justify-between items-center">
          <Typography variant="h5" className="text-lg sm:text-xl">My Posts</Typography>
          <Button 
            onClick={handleOpenPostDialog}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            color="teal"
          >
            <Plus size={14} /> Add Post
          </Button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
          {posts.map((post) => (
            <div 
              key={post.id} 
              className="relative group overflow-hidden rounded-lg cursor-pointer aspect-square"
            >
              <img 
                src={post.images[0]} 
                alt="Post"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white p-2 transition-opacity duration-300">
                <Typography color="white" variant="small" className="text-xs sm:text-sm">
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
          className="max-w-[90%] sm:max-w-xl md:max-w-2xl"
        >
          <DialogHeader className="text-lg sm:text-xl">Create New Post</DialogHeader>
          <DialogBody divider className="max-h-[70vh] overflow-y-auto">
            <div className="space-y-4">
              {!editMode && (
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="w-full text-sm sm:text-base"
                  multiple
                />
              )}

              {/* Rest of the dialog content with responsive classes */}
              <textarea 
                placeholder="Write a description..."
                value={newPost.description}
                onChange={handleDescriptionChange}
                className="w-full p-2 border rounded-lg text-sm sm:text-base"
                rows={4}
              />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Hash size={16} className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="Add hashtags (press Enter)"
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    onKeyPress={handleHashtagInput}
                    className="w-full p-2 border rounded-lg text-sm sm:text-base"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {newPost.hashtags?.map((tag, index) => (
                    <Chip
                      key={index}
                      value={`#${tag}`}
                      onClose={() => removeHashtag(tag)}
                      color="teal"
                      className="bg-teal-500 text-xs sm:text-sm"
                    />
                  ))}
                </div>
              </div>
            </div>
          </DialogBody>
          <DialogFooter className="gap-2">
            <Button 
              variant="text" 
              color="red" 
              onClick={handleOpenPostDialog}
              className="text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button 
              color="teal"
              onClick={handlePostSubmit}
              disabled={newPost.images.length === 0 || !newPost.description || editMode}
              className="text-xs sm:text-sm"
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
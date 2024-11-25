import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Chip,
} from "@material-tailwind/react";
import { Hash, Edit, X } from 'lucide-react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const EditBlogDialog = ({ open, handler, post, onSubmit }) => {
  const [editPost, setEditPost] = useState({
    images: [],
    description: '',
    hashtags: [],
    currentEditIndex: null
  });
  const [hashtagInput, setHashtagInput] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 100,
    height: 100
  });
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);

  // Initialize form with existing post data
  useEffect(() => {
    if (post) {
      setEditPost({
        images: (post.post_images || []).map(img => ({
          preview: img.post_image,
          file: null // We'll only update images that are changed
        })),
        description: post.description || '',
        hashtags: post.hashtags?.map(tag => tag.name) || [],
        currentEditIndex: null
      });
    }
  }, [post]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      preview: URL.createObjectURL(file),
      file: file
    }));
    
    setEditPost(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const handleEditImage = (index) => {
    setEditPost(prev => ({
      ...prev,
      currentEditIndex: index
    }));
    setEditMode(true);
    setRotation(0);
    setScale(1);
  };

  const handleRemoveImage = (index) => {
    setEditPost(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSaveEdit = () => {
    // Here you would typically apply the crop, rotation, and scale
    // For now, we'll just exit edit mode
    setEditMode(false);
    setEditPost(prev => ({
      ...prev,
      currentEditIndex: null
    }));
  };

  const handleHashtagInput = (e) => {
    if (e.key === 'Enter' && hashtagInput.trim()) {
      e.preventDefault();
      const newTag = hashtagInput.trim().replace(/^#/, '');
      if (!editPost.hashtags.includes(newTag)) {
        setEditPost(prev => ({
          ...prev,
          hashtags: [...prev.hashtags, newTag]
        }));
      }
      setHashtagInput('');
    }
  };

  const removeHashtag = (tagToRemove) => {
    setEditPost(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = () => {
    // Create FormData and append all the necessary data
    const formData = new FormData();
    formData.append('description', editPost.description);
    editPost.hashtags.forEach(tag => {
      formData.append('hashtags[]', tag);
    });
    
    // Only append images that have associated files (new or modified images)
    editPost.images.forEach((img, index) => {
      if (img.file) {
        formData.append(`images[]`, img.file);
      }
    });

    // Call the onSubmit prop with the formData
    onSubmit(formData);
    handler(); // Close dialog
  };

  return (
    <Dialog open={open} handler={handler} size="lg">
      <DialogHeader>Edit Post</DialogHeader>
      <DialogBody divider>
        <div className="space-y-4">
          {!editMode && (
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="w-full"
              multiple
            />
          )}

          {editMode && editPost.currentEditIndex !== null ? (
            <div className="space-y-4">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={16 / 9}
              >
                <img
                  src={editPost.images[editPost.currentEditIndex].preview}
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
                  variant="outlined"
                  size="sm"
                  onClick={() => setRotation(r => (r + 90) % 360)}
                  className="text-deep_orange-500 border-deep_orange-500 hover:border-deep-orange-800"
                >
                  Rotate
                </Button>
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}
                  className="text-deep_orange-500 border-deep_orange-500"
                >
                  Zoom Out
                </Button>
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => setScale(s => Math.min(s + 0.1, 3))}
                  className="text-deep_orange-500 border-deep_orange-500"
                >
                  Zoom In
                </Button>
              </div>
              
              <Button 
                onClick={handleSaveEdit}
                className="w-full"
                color="teal"
              >
                Apply Changes
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {editPost.images.map((img, index) => (
                <div key={index} className="relative">
                  <img 
                    src={img.preview} 
                    alt={`Preview ${index}`} 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleEditImage(index)}
                      className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
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
            value={editPost.description}
            onChange={(e) => setEditPost(prev => ({...prev, description: e.target.value}))}
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
              {editPost.hashtags?.map((tag, index) => (
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
          onClick={handler}
          className="mr-2"
        >
          Cancel
        </Button>
        <Button 
          color="teal"
          onClick={handleSubmit}
          disabled={editPost.images.length === 0 || !editPost.description || editMode}
        >
          Save Changes
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default EditBlogDialog;
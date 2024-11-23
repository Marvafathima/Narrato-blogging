import React, { useEffect, useState } from 'react';
import { Card, Typography, Avatar, Button, Dialog, DialogBody, DialogFooter, Spinner } from "@material-tailwind/react";
import { Camera, Edit, Plus, X } from 'lucide-react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
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
    description: '',
    currentEditIndex: null
  });
  
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
      setNewPost({ images: [], description: '', currentEditIndex: null });
      setEditMode(false);
      setCrop(undefined);
      setRotation(0);
      setScale(1);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
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
    if (newPost.images.length > 0 && newPost.description) {
      // Here you would typically send the data to your backend
      // For now, we'll just update the local state
      setPosts(prev => [
        ...prev,
        {
          id: Date.now(),
          images: newPost.images.map(img => img.preview),
          description: newPost.description
        }
      ]);
      
      setNewPost({ images: [], description: '', currentEditIndex: null });
      setOpenPostDialog(false);
    }
  };

  if (loading) {
    return <Spinner className="h-16 w-16 text-deep_orange-500" />;
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
        <Card className="p-6 mb-6 flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <Avatar 
              src={userDetails.profile_pic}
              alt="Profile" 
              size="xl" 
              className="border-4 border-deep_orange-400"
            />
            <button className="absolute bottom-0 right-0 bg-ocean_green-50 text-white rounded-full p-1">
              <Camera size={16} />
            </button>
          </div>
          
          <div className="text-center md:text-left">
            <Typography variant="h4">{userDetails.username}</Typography>
            <Typography variant="paragraph" className="text-gray-600">
              {userDetails.email}
            </Typography>
            <div className="flex gap-4 mt-2 justify-center md:justify-start">
              <Button size="sm" variant="outlined" className="flex items-center gap-2 text-ocean_green-50 border-ocean_green-100">
                <Edit size={16} className="text-ocean_green-50 ring-offset-teal-400" /> Edit Profile
              </Button>
            </div>
          </div>
        </Card>

        {/* Posts Section */}
        <div className="mb-6 flex justify-between items-center">
          <Typography variant="h5">My Posts</Typography>
          <Button 
            onClick={handleOpenPostDialog} 
            className="flex items-center gap-2 bg-deep-orange-300 ring-offset-cyan"
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
                <Typography variant="small">{post.description}</Typography>
              </div>
            </div>
          ))}
        </div>

        {/* Add Post Dialog */}
        <Dialog open={openPostDialog} handler={handleOpenPostDialog} size="lg">
          <DialogBody>
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
                      size="sm"
                      onClick={() => setRotation(r => (r + 90) % 360)}
                    >
                      Rotate
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}
                    >
                      Zoom Out
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setScale(s => Math.min(s + 0.1, 3))}
                    >
                      Zoom In
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={handleSaveEdit}
                    className="w-full"
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
              variant="gradient" 
              color="blue" 
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
// import React, { useEffect, useState } from 'react';
// import { Card, Typography, Avatar, Button, Dialog, DialogBody, DialogFooter,Spinner } from "@material-tailwind/react";
// import { Camera, Edit, Plus } from 'lucide-react';
// import Layout from './Layout';
// import { fetchUserDetails ,selectAuthError,selectAuthLoading,selectUserDetails} from '../app/slice/authSlice';
// import { useSelector,useDispatch } from 'react-redux';
// const UserProfile = () => {

// const dispatch=useDispatch()
// const userDetails=useSelector(selectUserDetails)
// const loading=useSelector(selectAuthLoading)
// const error=useSelector(selectAuthError)


// useEffect(()=>{
//   if (!userDetails){
//     dispatch(fetchUserDetails());}
  
// },[dispatch,userDetails]);


//   const [posts, setPosts] = useState([
//     { id: 1, image: "/api/placeholder/300/300", description: "Sunset in the mountains" },
//     { id: 2, image: "/api/placeholder/300/300", description: "Exploring city streets" },
//     { id: 3, image: "/api/placeholder/300/300", description: "Morning coffee ritual" },
//     { id: 4, image: "/api/placeholder/300/300", description: "Hiking adventure" },
//     { id: 5, image: "/api/placeholder/300/300", description: "Artistic capture" },
//     { id: 6, image: "/api/placeholder/300/300", description: "Urban landscape" }
//   ]);

//   const [openPostDialog, setOpenPostDialog] = useState(false);
//   const [newPost, setNewPost] = useState({ image: null, description: '' });

//   const handleOpenPostDialog = () => setOpenPostDialog(!openPostDialog);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setNewPost({
//         ...newPost, 
//         image: URL.createObjectURL(file)
//       });
//     }
//   };

//   const handlePostSubmit = () => {
//     if (newPost.image && newPost.description) {
//       setPosts([
//         ...posts, 
//         { 
//           id: posts.length + 1, 
//           image: newPost.image, 
//           description: newPost.description 
//         }
//       ]);
//       setNewPost({ image: null, description: '' });
//       setOpenPostDialog(false);
//     }
//   };
// if (loading){
//   return(
//     <Spinner className="h-16 w-16 text-deep_orange-500" />
//   )

// }
// if (error){
//   return(
//     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//     <p>Error: {error}</p>
//     <button 
//       onClick={() => dispatch(fetchUserDetails())}
//       className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//     >
//       Retry
//     </button>
//   </div>
//   )
// }
//   return (
//     <Layout>
//     <div className="container mx-auto p-4 max-w-4xl">
//       {/* Profile Header */}
//       <Card className="p-6 mb-6 flex flex-col md:flex-row items-center gap-6">
//         <div className="relative">
//           <Avatar 
//             src={userDetails.profile_pic}
//             alt="Profile" 
//             size="xl" 
//             className="border-4 border-deep_orange-400"
//           />
//           <button className="absolute bottom-0 right-0 bg-ocean_green-50 text-white rounded-full p-1">
//             <Camera size={16} />
//           </button>
//         </div>
        
//         <div className="text-center md:text-left">
//           <Typography variant="h4">{userDetails.username}</Typography>
//           <Typography variant="paragraph" className="text-gray-600">
//             {userDetails.email}
//           </Typography>
//           <div className="flex gap-4 mt-2 justify-center md:justify-start">
//             <Button size="sm" variant="outlined" className="flex items-center gap-2 text-ocean_green-50 border-ocean_green-100">
//               <Edit size={16} className='text-ocean_green-50  ring-offset-teal-400 '/> Edit Profile
//             </Button>
//           </div>
//         </div>
//       </Card>

//       {/* Posts Section */}
//       <div className="mb-6 flex justify-between items-center">
//         <Typography variant="h5">My Posts</Typography>
//         <Button 
//           onClick={handleOpenPostDialog} 
//           className="flex items-center gap-2 bg-deep-orange-300 ring-offset-cyan"
//         >
//           <Plus size={16} /> Add Post
//         </Button>
//       </div>

//       {/* Posts Grid */}
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//         {posts.map((post) => (
//           <div 
//             key={post.id} 
//             className="relative group overflow-hidden rounded-lg cursor-pointer"
//           >
//             <img 
//               src="/images22.jpeg" 
//               alt="/image2.jpg"
//               className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
//             />
//             <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white p-2 transition-opacity duration-300">
//               <Typography variant="small">{post.description}</Typography>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add Post Dialog */}
//       <Dialog open={openPostDialog} handler={handleOpenPostDialog}>
//         <DialogBody>
//           <div className="space-y-4">
//             <input 
//               type="file" 
//               accept="image/*" 
//               onChange={handleImageUpload} 
//               className="w-full"
//             />
//             {newPost.image && (
//               <img 
//                 src={newPost.image} 
//                 alt="Preview" 
//                 className="w-full h-64 object-cover rounded-lg"
//               />
//             )}
//             <textarea 
//               placeholder="Write a description..."
//               value={newPost.description}
//               onChange={(e) => setNewPost({...newPost, description: e.target.value})}
//               className="w-full p-2 border rounded-lg"
//               rows={4}
//             />
//           </div>
//         </DialogBody>
//         <DialogFooter>
//           <Button 
//             variant="text" 
//             color="red" 
//             onClick={handleOpenPostDialog}
//             className="mr-2"
//           >
//             Cancel
//           </Button>
//           <Button 
//             variant="gradient" 
//             color="blue" 
//             onClick={handlePostSubmit}
//             disabled={!newPost.image || !newPost.description}
//           >
//             Post
//           </Button>
//         </DialogFooter>
//       </Dialog>
//     </div></Layout>
//   );
// };

// export default UserProfile;
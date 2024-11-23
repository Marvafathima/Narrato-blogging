import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter, 
  Typography, 
  Input, 
  Button 
} from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import Layout from './Layout';
import { signupUser } from '../app/slice/authSlice';
import { selectAuthLoading } from '../app/slice/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserDetails } from '../app/slice/authSlice';
export function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password2: '',
    profile_pic: null
  });
 const dispatch=useDispatch()
 const navigate=useNavigate()
  const [errors, setErrors] = useState({});
  const loading = useSelector(selectAuthLoading);
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm Password validation
    if (formData.password !== formData.password2) {
      newErrors.password2 = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       // Submit form logic here
//       console.log('Form submitted', formData);
//     }
//   };
const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    
    // Explicitly add each field to ensure no blanks
    if (formData.email) formDataToSend.append('email', formData.email);
    if (formData.username) formDataToSend.append('username', formData.username);
    if (formData.password) formDataToSend.append('password', formData.password);
    if (formData.password2) formDataToSend.append('password2', formData.password2);
    
    // Handle profile picture separately
    if (formData.profile_pic) {
      formDataToSend.append('profile_pic', formData.profile_pic);
    }

    try {
        console.log("Form data to be sent:", Object.fromEntries(formDataToSend)); // Convert to object for easier logging
        const resultAction = await dispatch(signupUser(formDataToSend)).unwrap();
        dispatch(fetchUserDetails())
        navigate('/dashboard');
    } catch (err) {
        console.error('Signup failed:', err);
    }
  };
// const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     const formDataToSend = new FormData();
//     Object.keys(formData).forEach(key => {
//       if (key === 'profile_pic') {
//         if (formData[key]) {
//           formDataToSend.append(key, formData[key]);
//         }
//       } else {
//         formDataToSend.append(key, formData[key]);
//       }
//     });

//     try {
//         console.log("form data to be sned ",formDataToSend)
//         const resultAction = await dispatch(signupUser(formDataToSend)).unwrap();
//          navigate('/dashboard')
          
//     } catch (err) {
//       // Error is handled by the slice
//       console.error('Signup failed:', err);
//     }
//   };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  return (
    <Layout>
    <div className="flex justify-center items-center min-h-screen bg-orange-50 p-4">
      <Card className="w-full max-w-[24rem]">
        <CardHeader 
          variant="gradient"
          className="mb-4 grid h-28 place-items-center bg-deep-orange-400"
        >
          <Typography variant="h3" color="white">
            Sign Up
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Input 
            label="Email" 
            size="lg" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
          />
          {errors.email && (
            <Typography color="red" className="-mt-3 text-xs">
              {errors.email}
            </Typography>
          )}
          
          <Input 
            label="Username" 
            size="lg" 
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
          />
          {errors.username && (
            <Typography color="red" className="-mt-3 text-xs">
              {errors.username}
            </Typography>
          )}
          
          <Input 
            type="password" 
            label="Password" 
            size="lg" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
          />
          {errors.password && (
            <Typography color="red" className="-mt-3 text-xs">
              {errors.password}
            </Typography>
          )}
          
          <Input 
            type="password" 
            label="Confirm Password" 
            size="lg" 
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            error={!!errors.password2}
          />
          {errors.password2 && (
            <Typography color="red" className="-mt-3 text-xs">
              {errors.password2}
            </Typography>
          )}
          
          <Input 
            type="file" 
            label="Profile Picture" 
            size="lg" 
            name="profile_pic"
            onChange={handleChange}
          />
        </CardBody>
        <CardFooter className="pt-0">
          <Button 
          disabled={loading}
          className={`mt-1 rounded-lg sm:mt-0 bg-ocean_green-50
          text-white
          hover:bg-ocean_green-100
          hover:text-white
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}`
          
        }
            variant="fulfilled" 
            fullWidth 
            onClick={handleSubmit}
          >{loading ? 'Signing up...' : 'Sign up'}
          
            
          </Button>
          <Typography variant="small" className="mt-6 flex justify-center">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="ml-1 font-bold text-ocean_green-100"
            >
              Log In
            </Link>
          </Typography>
        </CardFooter>
      </Card>
    </div></Layout>
  );
}

export default Signup;
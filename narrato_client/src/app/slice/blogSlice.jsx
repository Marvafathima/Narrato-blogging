import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config';
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async thunk for fetching blogs
// export const fetchBlogs = createAsyncThunk(
//   'blog/fetchBlogs',
//   async ({ 
//     page = 1, 
//     pageSize = 10, 
//     search = '', 
//     hashtag = '' 
//   }, { getState, rejectWithValue }) => {
//     try {
//       // Get access token from auth state
//       const { accessToken } = getState().auth;

//       // Construct query parameters
//       const params = new URLSearchParams({
//         page,
//         page_size: pageSize,
//         ...(search && { search }),
//         ...(hashtag && { hashtag })
//       });

//       const response = await axios.get(`${BASE_URL}blogs/?${params}`, {
//         headers: {
//           'Authorization': `Bearer ${accessToken}`
//         }
//       });

//       return {
//         blogs: response.data.results,
//         total: response.data.count,
//         next: response.data.next,
//         previous: response.data.previous
//       };
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'An error occurred');
//     }
//   }
// );

// Async thunk for fetching user-specific blogs
// export const fetchUserBlogs = createAsyncThunk(
//   'blog/fetchUserBlogs',
//   async ({ 
//     page = 1, 
//     pageSize = 10 
//   }, { getState, rejectWithValue }) => {
//     try {
//       // Get access token from auth state
//       const { accessToken } = getState().auth;

//       const response = await axios.get(`${BASE_URL}user-blogs/`, {
//         params: { page, page_size: pageSize },
//         headers: {
//           'Authorization': `Bearer ${accessToken}`
//         }
//       });

//       return {
//         blogs: response.data.results,
//         total: response.data.count,
//         next: response.data.next,
//         previous: response.data.previous
//       };
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'An error occurred');
//     }
//   }
// );
export const fetchBlogs = createAsyncThunk(
    'blog/fetchBlogs',
    async ({ 
      page = 1, 
      pageSize = 10, 
      search = '', 
      hashtag = '' 
    }, { getState, rejectWithValue }) => {
      try {
        const { accessToken } = getState().auth;
  
        const params = new URLSearchParams({
          page,
          page_size: pageSize,
          ...(search && { search }),
          ...(hashtag && { hashtag })
        });
  
        const response = await axios.get(`${BASE_URL}blogs/?${params}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
  
        return {
          blogs: response.data.results,
          total: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
          page
        };
      } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occurred');
      }
    }
  );


  const blogSlice = createSlice({
    name: 'blog',
    initialState: {
      blogs: [],
      loading: false,
      error: null,
      pagination: {
        total: 0,
        next: null,
        previous: null,
        currentPage: 1
      }
    },
    reducers: {
      resetBlogState: (state) => {
        state.blogs = [];
        state.loading = false;
        state.error = null;
        state.pagination = {
          total: 0,
          next: null,
          previous: null,
          currentPage: 1
        };
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchBlogs.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchBlogs.fulfilled, (state, action) => {
          state.loading = false;
          
          // If it's the first page, replace blogs
          // Otherwise, append new blogs
          state.blogs = action.payload.page === 1 
            ? action.payload.blogs 
            : [...state.blogs, ...action.payload.blogs];
          
          state.pagination = {
            total: action.payload.total,
            next: action.payload.next,
            previous: action.payload.previous,
            currentPage: action.payload.page
          };
        })
        .addCase(fetchBlogs.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
  });
  
  export const { resetBlogState } = blogSlice.actions;
  export default blogSlice.reducer;
// Create the blog slice
// const blogSlice = createSlice({
//   name: 'blog',
//   initialState: {
//     blogs: [],
//     userBlogs: [],
//     loading: {
//       blogs: false,
//       userBlogs: false
//     },
//     error: {
//       blogs: null,
//       userBlogs: null
//     },
//     pagination: {
//       total: 0,
//       next: null,
//       previous: null
//     },
//     userPagination: {
//       total: 0,
//       next: null,
//       previous: null
//     }
//   },
//   reducers: {
//     // Optional: Reset state if needed
//     resetBlogState: (state) => {
//       state.blogs = [];
//       state.loading.blogs = false;
//       state.error.blogs = null;
//       state.pagination = {
//         total: 0,
//         next: null,
//         previous: null
//       };
//     }
//   },
//   extraReducers: (builder) => {
//     // Fetch All Blogs Reducers
//     builder
//       .addCase(fetchBlogs.pending, (state) => {
//         state.loading.blogs = true;
//         state.error.blogs = null;
//       })
//       .addCase(fetchBlogs.fulfilled, (state, action) => {
//         state.loading.blogs = false;
//         // Replace or append blogs based on page
//         state.blogs = action.meta.arg.page === 1 
//           ? action.payload.blogs 
//           : [...state.blogs, ...action.payload.blogs];
        
//         state.pagination = {
//           total: action.payload.total,
//           next: action.payload.next,
//           previous: action.payload.previous
//         };
//       })
//       .addCase(fetchBlogs.rejected, (state, action) => {
//         state.loading.blogs = false;
//         state.error.blogs = action.payload;
//       })
      
//     // Fetch User Blogs Reducers  
//     builder
//     //   .addCase(fetchUserBlogs.pending, (state) => {
//     //     state.loading.userBlogs = true;
//     //     state.error.userBlogs = null;
//     //   })
//     //   .addCase(fetchUserBlogs.fulfilled, (state, action) => {
//     //     state.loading.userBlogs = false;
//     //     // Replace or append user blogs based on page
//     //     state.userBlogs = action.meta.arg.page === 1 
//     //       ? action.payload.blogs 
//     //       : [...state.userBlogs, ...action.payload.blogs];
        
//     //     state.userPagination = {
//     //       total: action.payload.total,
//     //       next: action.payload.next,
//     //       previous: action.payload.previous
//     //     };
//     //   })
//     //   .addCase(fetchUserBlogs.rejected, (state, action) => {
//     //     state.loading.userBlogs = false;
//     //     state.error.userBlogs = action.payload;
//     //   });
//   }
// });

// export const { resetBlogState } = blogSlice.actions;
// export default blogSlice.reducer;
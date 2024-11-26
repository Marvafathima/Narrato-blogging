import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config';

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
  
        const response = await axios.get(`${BASE_URL}blogs/search/?${params}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
  
        return {
          blogs: response.data.results,
          total: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
          page,
          searchQuery: search || hashtag
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
      searchQuery: '',
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
        state.searchQuery = '';
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
        .addCase(fetchBlogs.pending, (state, action) => {
          state.loading = true;
          state.error = null;
          // Update search query
          state.searchQuery = action.meta.arg.search || action.meta.arg.hashtag || '';
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
// export const fetchBlogs = createAsyncThunk(
//     'blog/fetchBlogs',
//     async ({ 
//       page = 1, 
//       pageSize = 10, 
//       search = '', 
//       hashtag = '' 
//     }, { getState, rejectWithValue }) => {
//       try {
//         const { accessToken } = getState().auth;
  
//         const params = new URLSearchParams({
//           page,
//           page_size: pageSize,
//           ...(search && { search }),
//           ...(hashtag && { hashtag })
//         });
  
//         const response = await axios.get(`${BASE_URL}blogs/?${params}`, {
//           headers: {
//             'Authorization': `Bearer ${accessToken}`
//           }
//         });
  
//         return {
//           blogs: response.data.results,
//           total: response.data.count,
//           next: response.data.next,
//           previous: response.data.previous,
//           page
//         };
//       } catch (error) {
//         return rejectWithValue(error.response?.data || 'An error occurred');
//       }
//     }
//   );


//   const blogSlice = createSlice({
//     name: 'blog',
//     initialState: {
//       blogs: [],
//       loading: false,
//       error: null,
//       pagination: {
//         total: 0,
//         next: null,
//         previous: null,
//         currentPage: 1
//       }
//     },
//     reducers: {
//       resetBlogState: (state) => {
//         state.blogs = [];
//         state.loading = false;
//         state.error = null;
//         state.pagination = {
//           total: 0,
//           next: null,
//           previous: null,
//           currentPage: 1
//         };
//       }
//     },
//     extraReducers: (builder) => {
//       builder
//         .addCase(fetchBlogs.pending, (state) => {
//           state.loading = true;
//           state.error = null;
//         })
//         .addCase(fetchBlogs.fulfilled, (state, action) => {
//           state.loading = false;
          
//           // If it's the first page, replace blogs
//           // Otherwise, append new blogs
//           state.blogs = action.payload.page === 1 
//             ? action.payload.blogs 
//             : [...state.blogs, ...action.payload.blogs];
          
//           state.pagination = {
//             total: action.payload.total,
//             next: action.payload.next,
//             previous: action.payload.previous,
//             currentPage: action.payload.page
//           };
//         })
//         .addCase(fetchBlogs.rejected, (state, action) => {
//           state.loading = false;
//           state.error = action.payload;
//         });
//     }
//   });
  
  export const { resetBlogState } = blogSlice.actions;
  export default blogSlice.reducer;

// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Load user data from localStorage
const loadUserData = () => {
  try {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Error loading user data from localStorage:', error);
  }
  return null;
};

// Save user data to localStorage
const saveUserData = (data) => {
  try {
    localStorage.setItem('userData', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
  }
};

const initialState = {
  userData: loadUserData() || {
    name: '',
    email: '',
    phone: '',
    location: '',
    description: '',
    photoUrl: null,
    joinDate: new Date().toISOString().split('T')[0],
    enrolledCourses: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  isAuthenticated: false,
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = {
        ...state.userData,
        ...action.payload,
        updatedAt: new Date().toISOString()
      };
      // Persist to localStorage
      saveUserData(state.userData);
    },
    
    updateUserField: (state, action) => {
      const { field, value } = action.payload;
      state.userData[field] = value;
      state.userData.updatedAt = new Date().toISOString();
      saveUserData(state.userData);
    },
    
    enrollCourse: (state, action) => {
      const course = action.payload;
      if (!state.userData.enrolledCourses.find(c => c.id === course.id)) {
        state.userData.enrolledCourses.push({
          ...course,
          enrolledAt: new Date().toISOString(),
          progress: 0
        });
        state.userData.updatedAt = new Date().toISOString();
        saveUserData(state.userData);
      }
    },
    
    updateCourseProgress: (state, action) => {
      const { courseId, progress } = action.payload;
      const course = state.userData.enrolledCourses.find(c => c.id === courseId);
      if (course) {
        course.progress = progress;
        course.lastAccessedAt = new Date().toISOString();
        state.userData.updatedAt = new Date().toISOString();
        saveUserData(state.userData);
      }
    },
    
    unenrollCourse: (state, action) => {
      const courseId = action.payload;
      state.userData.enrolledCourses = state.userData.enrolledCourses.filter(
        c => c.id !== courseId
      );
      state.userData.updatedAt = new Date().toISOString();
      saveUserData(state.userData);
    },
    
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    clearUserData: (state) => {
      state.userData = {
        name: '',
        email: '',
        phone: '',
        location: '',
        description: '',
        photoUrl: null,
        joinDate: new Date().toISOString().split('T')[0],
        enrolledCourses: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      state.isAuthenticated = false;
      state.error = null;
      try {
        localStorage.removeItem('userData');
      } catch (error) {
        console.error('Error clearing user data from localStorage:', error);
      }
    },
    
    resetUserData: (state) => {
      const defaultData = {
        name: '',
        email: '',
        phone: '',
        location: '',
        description: '',
        photoUrl: null,
        joinDate: new Date().toISOString().split('T')[0],
        enrolledCourses: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      state.userData = defaultData;
      saveUserData(defaultData);
    }
  }
});

export const {
  setUserData,
  updateUserField,
  enrollCourse,
  updateCourseProgress,
  unenrollCourse,
  setAuthenticated,
  setLoading,
  setError,
  clearUserData,
  resetUserData
} = userSlice.actions;

export default userSlice.reducer;
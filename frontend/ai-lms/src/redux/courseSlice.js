import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axiosInstance";

// Async thunk alternative (manual dispatch)
export const fetchCourses = () => async (dispatch) => {
  try {
    dispatch(setCourseLoading(true));

    const res = await axiosInstance.get("/course/getCourses/published"); // backend endpoint
    console.log("Courses API Response:", res.data); // debug

    // If backend returns { success: true, courses: [...] }
    if (res.data.success && Array.isArray(res.data.courses)) {
      dispatch(setCourseData(res.data.courses));
    } else {
      dispatch(setCourseError("No courses found"));
    }
  } catch (error) {
    console.error("Fetch courses error:", error);
    dispatch(setCourseError(error.message || "Failed to fetch courses"));
  }
};

// Load courses from localStorage (optional fallback)
const loadCourseData = () => {
  try {
    const data = localStorage.getItem("courseData");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const initialState = {
  courseData: loadCourseData(), // starts with cached courses
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourseData: (state, action) => {
      state.courseData = action.payload;
      state.loading = false;
      state.error = null;

      // Optional: cache courses locally
      localStorage.setItem("courseData", JSON.stringify(action.payload));
    },

    setCourseLoading: (state, action) => {
      state.loading = action.payload;
    },

    setCourseError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setCourseData, setCourseLoading, setCourseError } =
  courseSlice.actions;

export default courseSlice.reducer;

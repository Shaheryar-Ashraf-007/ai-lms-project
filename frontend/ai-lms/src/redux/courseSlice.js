import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axiosInstance";

export const fetchCourses = () => async (dispatch) => {
  try {
    dispatch(setCourseLoading(true));

    const res = await axiosInstance.get("/course/getCourses/published");

    console.log("Courses API Response:", res.data);

    // Case 1: backend returns {success:true, courses:[]}
    if (res.data?.courses) {
      dispatch(setCourseData(res.data.courses));
    }

    // Case 2: backend returns array directly
    else if (Array.isArray(res.data)) {
      dispatch(setCourseData(res.data));
    }

    else {
      dispatch(setCourseError("No courses found"));
    }

  } catch (error) {
    console.error("Fetch courses error:", error);
    dispatch(setCourseError(error.response?.data?.message || "Failed to fetch courses"));
  }
};

const loadCourseData = () => {
  try {
    const data = localStorage.getItem("courseData");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const initialState = {
  courseData: loadCourseData(),
  loading: false,
  error: null,
  selectedCourse: null,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourseData: (state, action) => {
      state.courseData = action.payload;
      state.loading = false;
      state.error = null;

      localStorage.setItem("courseData", JSON.stringify(action.payload));
    },

    setCourseLoading: (state, action) => {
      state.loading = action.payload;
    },

    setCourseError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },
  },
});

export const {
  setCourseData,
  setSelectedCourse,
  setCourseLoading,
  setCourseError,
} = courseSlice.actions;

export default courseSlice.reducer;
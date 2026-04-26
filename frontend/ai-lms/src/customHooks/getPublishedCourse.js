import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "../../lib/axiosInstance";
import { setCourseData } from "../redux/courseSlice";

const useGetPublishedCourse = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getCourseData = async () => {
      try {
        const response = await axiosInstance.get(
          "/course/getCourses/published",
          {
            withCredentials: true,
          },
        );
        console.log(response.data);
        dispatch(setCourseData(response.data.courses));
      } catch (error) {
        console.error("Error fetching published courses:", error);
      }
    };

    getCourseData();
  }, []);
};

export default useGetPublishedCourse;

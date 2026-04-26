import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setLectureData } from "../../redux/lectureSlice";
import axiosInstance from "../../../lib/axiosInstance";
import { ClipLoader } from "react-spinners";

const EditLecture = () => {
  const { lectureId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { lectureData } = useSelector((state) => state.lecture);

  const selectedLecture = lectureData.find(
    (lecture) => lecture._id === lectureId
  );

  const [lectureTitle, setLectureTitle] = useState("");
  const [isPreviewFree, setIsPreviewFree] = useState(false);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading1, setloading1] = useState(false);

  // ✅ Prefill existing lecture data
  useEffect(() => {
    if (selectedLecture) {
      setLectureTitle(selectedLecture.lectureTitle || "");
      setIsPreviewFree(selectedLecture.isPreviewFree || false);
    }
  }, [selectedLecture]);

  // ✅ Save Lecture
  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("lectureTitle", lectureTitle);
      formData.append("isPreviewFree", isPreviewFree.toString());

      if (video) {
        formData.append("video", video);
      }

      const response = await axiosInstance.post(
        `/course/editlecture/${lectureId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log("Edit response:", response.data); // 🔍 debug
      setloading1(true);

      if (response.data.success) {
        const updatedLectures = lectureData.map((lec) =>
          lec._id === lectureId ? response.data.lecture : lec
        );

        dispatch(setLectureData(updatedLectures));

        toast.success("Lecture updated successfully");
        navigate("/courses")
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update lecture");
    } finally {
      setLoading(false);
    }
  };

 const removeLecture = async () => {
  try {
    setloading1(true);

    const response = await axiosInstance.delete(
      `/course/deleteLecture/${selectedLecture.courseId}/${lectureId}`,
      { withCredentials: true }
    );

    console.log("Delete response:", response.data);

    if (response.data.success) {
      // ✅ Remove lecture from Redux
      const updatedLectures = lectureData.filter(
        (lec) => lec._id !== lectureId
      );

      dispatch(setLectureData(updatedLectures));

      toast.success("Lecture deleted successfully");

      navigate("/courses");
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete lecture");
  } finally {
    setloading1(false);
  }
};

  if (!selectedLecture) {
    return <div className="p-6 text-red-500">Lecture not found</div>;
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-slate-200">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800">
          Edit Lecture
        </h2>
        <button className="bg-red-600 rounded-md text-white p-2 cursor-pointer" disabled= {loading1} onClick={removeLecture}>{loading1 ? <ClipLoader size={30} color="white" /> : "Lecture Removed"}</button>
      </div>
        <p className="text-slate-500 mt-1">
          Update lecture details and preview settings
        </p>

      {/* Lecture Title */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-600 mb-2">
          Lecture Title
        </label>
        <input
          type="text"
          value={lectureTitle}
          onChange={(e) => setLectureTitle(e.target.value)}
          className="w-full border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all px-4 py-3 rounded-xl outline-none"
          placeholder="Enter lecture title"
        />
      </div>

      {/* Video Upload */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-600 mb-2">
          Upload New Video
        </label>

        <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 transition rounded-xl p-6 text-center cursor-pointer">
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            className="w-full"
          />
          <p className="text-sm text-slate-400 mt-2">
            Select a video file to replace existing one
          </p>
        </div>
      </div>

      {/* Free Preview Toggle */}
      <div className="mb-8 flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <p className="font-semibold text-slate-700">Free Preview</p>
          <p className="text-sm text-slate-500">
            Allow students to watch this lecture for free
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isPreviewFree}
            onChange={(e) => setIsPreviewFree(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-6"></div>
        </label>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Updating Lecture..." : "Save Changes"}
      </button>
    </div>
  </div>
);
}

export default EditLecture;

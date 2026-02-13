import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import Profile from "../../../components/profile/Profile";

const DEFAULT_PROFILE = "/default-profile.png";
 
const AdminProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
 
  const token = localStorage.getItem("access_token");
  const userId = localStorage.getItem("userId"); // backend should use this
 
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await axiosInstance.get(
          "employee/admin/profile/"
        );
 
        const d = response.data;

        // ✅ Save admin name for header
        if (d?.personal) {
          localStorage.setItem("first_name", d.personal.first_name || "");
          localStorage.setItem("last_name", d.personal.last_name || "");
        }

        if (d.profile_picture_url) {
          localStorage.setItem("profile_picture_url", d.profile_picture_url);
        }

        setProfileData({
          title: "ADMIN PROFILE",
          editable: true,

          personal: {
            ...d.personal,
            profile_picture_url:
              d.personal?.profile_picture_url ||
              d.profile_picture_url ||
              DEFAULT_PROFILE,
          },

          professional: d.professional || {},
          address: d.address || {},
        });

      } catch (error) {
        console.error("Failed to load admin profile", error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchAdminProfile();
  }, [userId, token]);
 
  if (loading) return <h4 className="text-center mt-4">Loading...</h4>;
  if (!profileData) return <h4 className="text-center text-danger">Failed to load profile</h4>;
 
  return <Profile {...profileData} />;
};
 
export default AdminProfile;
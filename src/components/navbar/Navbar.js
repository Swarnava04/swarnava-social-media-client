import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.scss";
import { HiOutlineLogout } from "react-icons/hi";
import Avatar from "../avatar/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setToast } from "../../redux/slices/appConfigSlice";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localStorageManager";
import { TOAST_SUCCESS } from "../../App";
function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
  async function handleLogoutButton() {
    dispatch(setLoading(true));
    dispatch(
      setToast({
        key: TOAST_SUCCESS,
        message: "Logged out successfully",
      })
    );
    await axiosClient.post("/auth/logout"); //the refresh token is removed from the cookie
    removeItem(KEY_ACCESS_TOKEN); //the accesstoken is removed from the local storage
    navigate("/login");
    dispatch(setLoading(false));
  }
  return (
    <div className="Navbar">
      <div className="container">
        <h2 className="banner hover-link" onClick={() => navigate("/")}>
          Social Media
        </h2>
        <div className="right-side">
          <div
            className="profile hover-link"
            onClick={() => navigate(`/profile/${myProfile._id}`)}
          >
            <Avatar src={myProfile?.avatar?.url} />
          </div>
          <div className="logout hover-link">
            <HiOutlineLogout
              className="hover-link logout"
              onClick={handleLogoutButton}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;

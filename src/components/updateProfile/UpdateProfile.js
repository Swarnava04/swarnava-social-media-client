import React, { useEffect, useState } from "react";
import noPostImage from "../../assets/noPostImage.png";
import "./UpdateProfile.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setToast,
  updateMyProfile,
} from "../../redux/slices/appConfigSlice";
import { TOAST_SUCCESS } from "../../App";
import { axiosClient } from "../../utils/axiosClient";
import { useNavigate } from "react-router-dom";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localStorageManager";

function UpdateProfile() {
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [userImg, setUserImg] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    setName(myProfile?.name || "");
    setBio(myProfile?.bio || "");
    setUserImg(myProfile?.avatar?.url || "");
  }, [myProfile]);
  function handleImageChange(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setUserImg(fileReader.result);
        console.log(fileReader.result);
      }
    };
  }
  function handleSubmit(e) {
    e.preventDefault();
    dispatch(
      updateMyProfile({
        name,
        bio,
        userImg,
      })
    );
    dispatch(
      setToast({
        type: TOAST_SUCCESS,
        message: "Profile updated successfully",
      })
    );
  }
  async function handleDeleteAccount() {
    dispatch(setLoading(true));
    await axiosClient.get("/user/deleteMyProfile"); //all likes, post , following and followers are removed and then the refresh token is removed from the cookie
    removeItem(KEY_ACCESS_TOKEN); //the accesstoken is removed from the local storage
    navigate("/login");
    dispatch(
      setToast({
        type: TOAST_SUCCESS,
        message: "Account Deleted successfully",
      })
    );
    dispatch(setLoading(false));
  }
  return (
    <div className="UpdateProfile">
      <div className="container">
        <div className="left-part">
          <div className="input-user-img">
            <label htmlFor="userImg" className="labelImg">
              <img
                src={userImg ? userImg : noPostImage}
                className="user-img"
                alt={name}
              />
            </label>
            <input
              className="inputImage"
              type="file"
              id="userImg"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="right-part">
          <form>
            <input
              type="text"
              value={name}
              placeholder="Your Name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              value={bio}
              placeholder="Your Bio"
              onChange={(e) => setBio(e.target.value)}
            />
            <input
              type="submit"
              className="btn-primary"
              onClick={handleSubmit}
            />
          </form>
          <button className="delete-account" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;

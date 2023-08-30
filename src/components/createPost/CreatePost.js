import React, { useState } from "react";
import Avatar from "../avatar/Avatar";
// import backgroundDummyImage from "../../assets/mountain.jpg";
import "./CreatePost.scss";
import { AiFillFileImage } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { axiosClient } from "../../utils/axiosClient";
import { setLoading, setToast } from "../../redux/slices/appConfigSlice";
import { getUserProfile } from "../../redux/slices/postsSlice";
import { TOAST_SUCCESS } from "../../App";

function CreatePost() {
  const [postImg, setPostImg] = useState("");
  const [caption, setCaption] = useState("");
  const dispatch = useDispatch();
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
  function handleImageChange(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setPostImg(fileReader.result);
        // console.log(fileReader.result);
      }
    };
  }
  async function handlePostSubmit(e) {
    try {
      dispatch(setLoading(true));
      //here I have not created another dedicated api for Post Submit. Rather, I have called the post api and the updated the userProfile reducer with myProfile id.
      await axiosClient.post("/posts/", {
        caption,
        postImg,
      });
      // console.log("post is", response);
      dispatch(
        getUserProfile({
          userId: myProfile?._id,
        })
      );
    } catch (e) {
      return Promise.reject(e);
    } finally {
      dispatch(setLoading(false));
      dispatch(
        setToast({
          type: TOAST_SUCCESS,
          message: "Post added successfully",
        })
      );
      setCaption("");
      setPostImg("");
    }
  }
  return (
    <div className="CreatePost">
      <div className="leftPart">
        <Avatar src={myProfile?.avatar?.url} />
      </div>
      <div className="rightPart">
        <input
          type="text"
          className="captionInput"
          placeholder="what do you want to share"
          onChange={(e) => {
            setCaption(e.target.value);
          }}
        />
        {postImg && (
          <div className="img-container">
            <img src={postImg} alt="" className="post-img" />
          </div>
        )}
      </div>
      <div className="bottom-part">
        <div className="input-post-img">
          <label htmlFor="userImg" className="labelImg">
            <AiFillFileImage className="icon" />
          </label>
          <input
            className="inputImage"
            type="file"
            id="userImg"
            onChange={handleImageChange}
          />
        </div>
        <button className="post-button btn-primary" onClick={handlePostSubmit}>
          Post
        </button>
      </div>
    </div>
  );
}

export default CreatePost;

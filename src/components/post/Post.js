import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Avatar from "../avatar/Avatar";
import "./Post.scss";
import { AiFillDelete, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
// import background from "../../assets/mountain.jpg";
import {
  deletePostController,
  likeAndUnlikePost,
} from "../../redux/slices/postsSlice";
import { setToast } from "../../redux/slices/appConfigSlice";
import { TOAST_SUCCESS } from "../../App";
function Post({ post }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function handlePostLiked() {
    dispatch(
      setToast({
        type: TOAST_SUCCESS,
        message: "like or unliked",
      })
    );
    dispatch(
      likeAndUnlikePost({
        postId: post._id,
      })
    );
  }

  async function handledeletePostButton() {
    try {
      // console.log("we are inside delete post button");
      dispatch(
        deletePostController({
          postId: post._id,
        })
      );
    } catch (e) {
      return Promise.reject(e);
    }
  }

  return (
    <div className="Post">
      <div
        className="heading"
        onClick={() => navigate(`/profile/${post.owner._id}`)}
      >
        <Avatar src={post?.owner?.avatar?.url} />
        <h4>{post?.owner?.name}</h4>
      </div>
      <div className="content">
        <img src={post?.image?.url} alt="could not be loaded" />
      </div>
      <div className="footer">
        <div className="likes" onClick={handlePostLiked}>
          {post.isLiked ? (
            <AiFillHeart style={{ color: "red" }} className="icon" />
          ) : (
            <AiOutlineHeart className="icon" />
          )}
          <h4>{post?.likesCount} likes</h4>
        </div>
        <div className="delete" onClick={handledeletePostButton}>
          <AiFillDelete style={{ width: "20px", height: "20px" }} />
        </div>
      </div>
      <p className="caption">{post?.caption}</p>
      <h6 className="time-ago">{post?.timeAgo}</h6>
    </div>
  );
}

export default Post;

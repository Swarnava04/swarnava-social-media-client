import React, { useEffect, useState } from "react";
import Post from "../post/Post";
// import userImg from "../../assets/user.png";
import CreatePost from "../createPost/CreatePost";
import "./Profile.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../redux/slices/postsSlice";
import { followAndUnfollowUser } from "../../redux/slices/feedSlice";
import { setToast } from "../../redux/slices/appConfigSlice";
import { TOAST_SUCCESS } from "../../App";
function Profile() {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.postsReducer.userProfile);
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
  const feedData = useSelector((state) => state.getFeedReducer.feedData);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    dispatch(
      getUserProfile({
        userId: params.userId,
      })
    );
    setIsMyProfile(myProfile?._id === params.userId);
    setIsFollowing(
      feedData?.followings?.find(
        (eachFollowing) => eachFollowing._id === params.userId
      )
    );
    console.log(userProfile);
  }, [myProfile, params.userId, feedData]);
  function handleFollowButton() {
    dispatch(
      setToast({
        type: TOAST_SUCCESS,
        message: "followed or unfollowed",
      })
    );
    dispatch(
      followAndUnfollowUser({
        userIdToFollow: params.userId,
      })
    );
  }

  return (
    <div className="Profile">
      <div className="container">
        <div className="left-part">
          {isMyProfile && <CreatePost />}
          {/* if it is my profile, then show the createPost component */}
          {userProfile?.posts?.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
        <div className="right-part">
          <div className="profile-card">
            <img src={userProfile?.avatar?.url} alt="" className="user-img" />
            <h3 className="user-name">{userProfile?.name}</h3>
            <p className="bio">{userProfile?.bio}</p>
            <div className="follower-info">
              <h4>{userProfile?.followers?.length} followers</h4>
              <h4>{userProfile?.followings?.length} following</h4>
            </div>
            {!isMyProfile && (
              <button
                className={
                  isFollowing
                    ? "follow-link hover-link"
                    : "hover-link btn-primary"
                }
                onClick={handleFollowButton}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
            {isMyProfile && (
              <button
                className=" update-profile btn-secondary"
                onClick={(e) => {
                  navigate("/updateprofile");
                }}
              >
                Update Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

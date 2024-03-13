import React, { useEffect, useState } from "react";
import Avatar from "../avatar/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Follower.scss";
import { followAndUnfollowUser } from "../../redux/slices/feedSlice";
import { setToast } from "../../redux/slices/appConfigSlice";
import { TOAST_SUCCESS } from "../../App";
function Follower({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const feedData = useSelector((state) => state.getFeedReducer.feedData);
  const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    // console.log("feedData", feedData);
    if (
      feedData?.followings?.find(
        (eachFollowing) => eachFollowing._id === user._id
      )
    ) {
      setIsFollowing(true); //if user id contains the following id, then I am making the setIsFollowing to be true
    } else {
      setIsFollowing(false);
    }
  }, [feedData]);

  function handleFollowButton() {
    dispatch(
      setToast({ type: TOAST_SUCCESS, message: "followed or unfollowed " })
    );
    dispatch(
      followAndUnfollowUser({
        userIdToFollow: user._id,
      })
    );
  }

  return (
    <div className="follower">
      <div
        className="user-info"
        onClick={() => navigate(`/profile/${user._id}`)}
      >
        <Avatar src={user?.avatar?.url} />
        <h4 className="name">{user?.name}</h4>
      </div>
      <h5
        className={
          isFollowing ? "follow-link hover-link" : "hover-link btn-primary"
        }
        onClick={handleFollowButton}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </h5>
    </div>
  );
}

export default Follower;

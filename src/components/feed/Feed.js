import React, { useEffect } from "react";
import "./Feed.scss";
import Post from "../post/Post";
import Follower from "../follower/Follower";
import { useDispatch, useSelector } from "react-redux";
import { getFeedData } from "../../redux/slices/feedSlice";
function Feed() {
  const dispatch = useDispatch();
  const feedData = useSelector((state) => state.getFeedReducer.feedData);
  useEffect(() => {
    dispatch(getFeedData());
  }, []);
  return (
    <div className="Feed">
      <div className="container">
        <div className="left-part">
          {feedData?.posts?.map((eachPost) => (
            <Post key={eachPost._id} post={eachPost} />
          ))}
        </div>
        <div className="right-part">
          <div className="following">
            <h3 className="title">You are following :</h3>
            {feedData?.followings?.map((eachFollower) => (
              <Follower key={eachFollower._id} user={eachFollower} />
            ))}
          </div>
          <div className="suggestions">
            <h3 className="title">Suggested for you:</h3>
            {feedData?.suggestions?.map((eachSuggestion) => (
              <Follower key={eachSuggestion._id} user={eachSuggestion} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feed;

import React from "react";
import "./Avatar.scss";
import userImg from "../../assets/user.png";
function Avatar(props) {
  return (
    <div className="Avatar">
      <img src={props.src ? props.src : userImg} alt="User Avatar" />
    </div>
  );
}

export default Avatar;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { setLoading } from "./appConfigSlice";
import { axiosClient } from "../../utils/axiosClient";
import { likeAndUnlikePost } from "./postsSlice";
export const getFeedData = createAsyncThunk(
  "user/getFeedData",
  async (_, thunkAPI) => {
    try {
      // thunkAPI.dispatch(setLoading(true));
      const response = await axiosClient.get("/user/getFeedData");
      console.log("getFeedData wala api is working", response);
      return response;
    } catch (e) {
      return Promise.reject(e);
    }
    // finally {
    //   thunkAPI.dispatch(setLoading(false));
    // }
  }
);
export const followAndUnfollowUser = createAsyncThunk(
  "user/followAndUnfollow",
  async (body, thunkAPI) => {
    try {
      // thunkAPI.dispatch(setLoading(true));
      const response = await axiosClient.post("/user/follow", body);
      // console.log("follow and unfollow wala api is working", response);
      return response;
    } catch (e) {
      return Promise.reject(e);
    }
    // finally {
    //   thunkAPI.dispatch(setLoading(false));
    // }
  }
);
const feedSlice = createSlice({
  name: "feedSlice",
  initialState: {
    feedData: {},
  },
  extraReducers: (builder) => {
    builder.addCase(getFeedData.fulfilled, (state, action) => {
      state.feedData = action.payload.result;
    });
    builder.addCase(likeAndUnlikePost.fulfilled, (state, action) => {
      const post = action.payload.result.post;
      const index = state.feedData?.posts?.findIndex(
        (item) => item._id === post._id
      );
      // console.log("feedindex ", index);
      // console.log("the posts are(inside the extraReducer)", post);
      if (index !== undefined && index !== -1) {
        state.feedData.posts[index] = post;
      }
    });
    builder.addCase(followAndUnfollowUser.fulfilled, (state, action) => {
      // console.log(action.payload, "it is fullfilled");
      const user = action.payload.result.user;
      // console.log("user inside the reducer is", user);
      // console.log(userId);
      // const isTrue = state.feedData;
      // const isTrue2 = state?.feedData?.followings;
      // console.log(isTrue2);
      const index = state.feedData?.followings?.findIndex(
        (item) => item._id === user._id
      );
      // console.log("inside follow and unfollow reducer", index);
      if (index !== -1) {
        //already present
        state?.feedData?.followings?.splice(index, 1);
      } else {
        //not present
        state?.feedData?.followings?.push(user);
      }
    });
  },
});

export default feedSlice.reducer;

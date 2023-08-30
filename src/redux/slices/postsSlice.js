import { axiosClient } from "../../utils/axiosClient";
// import { setLoading } from "./appConfigSlice";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (body, thunkAPI) => {
    try {
      // thunkAPI.dispatch(setLoading(true));
      // console.log(body);
      const response = await axiosClient.post("/user/getUserProfile", body);
      console.log("getUserProfile wala api is working", response);
      return response;
    } catch (e) {
      return Promise.reject(e);
    }
    // finally {
    //   thunkAPI.dispatch(setLoading(false));
    // }
  }
);

export const likeAndUnlikePost = createAsyncThunk(
  "post/likesAndUnlikes",
  async (body, thunkAPI) => {
    try {
      // thunkAPI.dispatch(setLoading(true));
      const response = await axiosClient.post("/posts/like", body);
      console.log("like wala api  is working", response);
      return response;
    } catch (e) {
      return Promise.reject(e);
    }
    // finally {
    //   thunkAPI.dispatch(setLoading(false));
    // }
  }
);
export const deletePostController = createAsyncThunk(
  "posts/deleteController",
  async (body, thunkAPI) => {
    try {
      console.log("we are inside the delete post Controller");
      const response = await axiosClient.post("/posts/delete", body);
      console.log(response);
      return response;
    } catch (e) {
      return Promise.reject(e);
    }
  }
);
const postsSlice = createSlice({
  name: "postsSlice",
  initialState: {
    userProfile: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload.result;
      })
      .addCase(likeAndUnlikePost.fulfilled, (state, action) => {
        const post = action.payload.result.post; //from the backend we are fetching the post with the updated like count and isLiked parameter
        const index = state?.userProfile?.posts?.findIndex(
          (singlePost) => singlePost._id === post._id
        );
        console.log("postIndex ", index);
        if (index !== undefined && index !== -1) {
          state.userProfile.posts[index] = post; //updating with the new post(everything is the same other than the like and unlike parameter)'
          // console.log("the final post is", state.userProfile);
        }
      })
      .addCase(deletePostController.fulfilled, (state, action) => {
        console.log("we are inside delete post reducer");
        const deletedPost = action.payload.result;
        const index = state?.userProfile?.posts.findIndex(
          //fetching the index of the deleted post in the current set of posts in the user index
          (eachPost) => eachPost._id === deletedPost._id
        );
        console.log("the index of the deleted post is", index);
        state.userProfile?.posts?.splice(index, 1);
      });
  },
});

export default postsSlice.reducer;

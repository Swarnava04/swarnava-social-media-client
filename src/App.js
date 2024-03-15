import { Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Home from "./pages/home/Home";
import RequireUser from "./components/RequireUser";
import Feed from "./components/feed/Feed";
import Profile from "./components/profile/Profile";
import UpdateProfile from "./components/updateProfile/UpdateProfile";
import { useSelector } from "react-redux";
import LoadingBar from "react-top-loading-bar";
import { useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
export const TOAST_SUCCESS = "toast_success";
export const TOAST_FAILURE = "toast_failure";
function App() {
  const isLoading = useSelector((state) => state.appConfigReducer.isLoading);
  const toastData = useSelector((state) => state.appConfigReducer.toastData);
  const ref = useRef(null);
  useEffect(() => {
    if (isLoading) {
      ref.current?.continuousStart();
    } else {
      ref.current?.complete();
    }
  }, [isLoading]);
  useEffect(() => {
    switch (toastData.type) {
      case TOAST_SUCCESS:
        toast.success(toastData.message);
        break;
      case TOAST_FAILURE:
        toast.error(toastData.message);
        break;
    }
  }, [toastData]);
  return (
    <div className="App">
      <LoadingBar color="#000" ref={ref} />;
      <div>
        <Toaster />
      </div>
      <Routes>
        <Route element={<RequireUser />}>
          <Route element={<Home />}>
            <Route path="/" element={<Feed />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/updateprofile" element={<UpdateProfile />} /> //these
            are all the routes(random comment to check whether it is working on
            git and github) //hello random check 2
          </Route>
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;

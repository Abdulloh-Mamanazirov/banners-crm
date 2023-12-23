import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Login,
  Users,
  Admins,
  Banners,
  Create,
  Orders,
  NotFound,
} from "./pages";
import Layout from "./layout";

function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const token = sessionStorage.getItem("banner-token");

  useEffect(() => {
    window.scrollTo({
      behavior: "smooth",
      left: 0,
      top: 0,
    });
    if (!token && pathname !== "/login") navigate("/login");
  }, [pathname]);

  return (
    <>
      {token ? (
        <Layout
          content={
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<Users />} />
              <Route path="/admins" element={<Admins />} />
              <Route path="/banners" element={<Banners />} />
              <Route path="/banners/add" element={<Create />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          }
        />
      ) : (
        <Login />
      )}
    </>
  );
}

export default App;

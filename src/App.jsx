import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Login,
  Admins,
  Banners,
  Create,
  Orders,
  NotFound,
  Income,
  Outcome,
  FinanceLogs,
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
              <Route path="/admins" element={<Admins />} />
              <Route path="/banners" element={<Banners />} />
              <Route path="/banners/add" element={<Create />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/income" element={<Income />} />
              <Route path="/outcome" element={<Outcome />} />
              <Route path="/logs" element={<FinanceLogs />} />
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

import axios from "axios";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Login } from "../../../assets";

const index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let token = sessionStorage.getItem("banner-token");
    if (token) {
      sessionStorage.removeItem("banner-token");
      window.location.reload();
    }
  }, []);

  async function handleLogIn(e) {
    e.preventDefault();
    setLoading(true);

    let { username, password } = e.target;

    let { data } = await axios
      .post("/auth/", {
        username: username.value,
        password: password.value,
      })
      .catch((err) => {
        if (Number(err.response.status) === 400) {
          return toast("Login yoki parol xato!", { type: "error" });
        } else {
          return toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      })
      .finally(() => setLoading(false));
    if (data.token) {
      sessionStorage.setItem("banner-token", data.token);
      window.location.replace("/");
    }
  }

  return (
    <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
      <div className="hidden md:w-1/3 md:block max-w-sm">
        <img className="select-none" src={Login} alt="Illustration of a PC" />
      </div>
      <form onSubmit={handleLogIn} className="w-full md:w-1/3 max-w-sm">
        <div className="text-center md:text-left mb-5">
          <h2 className="text-4xl font-semibold md:text-5xl">Kirish</h2>
        </div>
        <input
          required
          className="input input-bordered w-full mb-3"
          type="text"
          name="username"
          placeholder="Username"
          title="Enter username"
        />
        <input
          required
          type="password"
          name="password"
          title="Enter password"
          placeholder="********"
          className="input input-bordered w-full"
        />
        <div className="mt-4 flex justify-between font-semibold text-sm">
          <label className="flex text-slate-500 hover:text-slate-600 cursor-pointer">
            <input
              className="mr-1 checkbox checkbox-sm checkbox-primary"
              type="checkbox"
              name="remember"
            />
            <span>Yodda saqlash</span>
          </label>
          <button hidden className="link link-hover link-primary">
            Forgot Password?
          </button>
        </div>
        <div className="text-center md:text-left">
          <button
            disabled={loading}
            className="btn btn-primary btn-active w-full mt-5"
            type="submit"
          >
            {!loading ? (
              "Kirish"
            ) : (
              <span className="fa-solid fa-spinner fa-spin-pulse" />
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default index;

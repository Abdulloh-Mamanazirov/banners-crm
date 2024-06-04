import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PAGES } from "../constants";

const index = ({ content }) => {
  const { pathname } = useLocation();
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [checkConnection, setCheckConnection] = useState(true);

  useEffect(() => {
    setInterval(() => {
      setIsOnline(window.navigator.onLine);
      setCheckConnection(!checkConnection);
    }, 5000);
  }, [checkConnection]);

  async function handleLogOut() {
    sessionStorage.removeItem("banner-token");
    return window.location.replace("/login");
  }

  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content relative flex flex-col px-5 py-3">
          {/* Nav bar */}
          <div className="z-50 sticky top-0 bg-base-100">
            <div
              hidden={isOnline}
              className=" py-2 bg-base-content text-center text-white italic rounded-xl"
            >
              Internetga ulanmagansiz.
            </div>
            <div className="flex items-center justify-between mb-3 mt-1 border-b border-gray-400">
              <label
                htmlFor="drawer"
                className="btn btn-active drawer-button relative mb-1 lg:hidden"
              >
                <span
                  className="absolute bg-cov inset-0 tooltip tooltip-right normal-case"
                  data-tip="Menu"
                />
                <span className="fa-regular fa-chart-bar" />
              </label>
              <div className="ml-auto mb-1">
                <button
                  onClick={handleLogOut}
                  className="btn btn-error"
                  title="Log Out"
                >
                  <span className="fa-solid fa-right-from-bracket text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Page content here */}
          {content}
        </div>
        <div className="drawer-side z-[9999] ">
          <label
            htmlFor="drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content text-lg">
            <h2 className="font-bold text-2xl text-base-content opacity-70 mb-5">
              Dashboard
            </h2>
            {/* Sidebar content here */}
            {PAGES.map((page, ind) => (
              <li
                key={ind}
                className={`mb-2 ${
                  pathname === page.path &&
                  "bg-blue-400 rounded-lg bg-opacity-10"
                }`}
              >
                <Link to={page.path}>
                  <span className={page.iconClass} /> {page.title}
                </Link>
              </li>
            ))}
            <details open className="ml-5">
              <summary className="">&nbsp;Moliya</summary>
              <ul className="mt-2">
                <li
                  className={`mb-2 ${
                    pathname === "/income" &&
                    "bg-blue-400 rounded-lg bg-opacity-10"
                  }`}
                >
                  <Link to={"/income"}>
                    <span className={"fa-solid fa-money-bill"} /> {"Kirim"}
                  </Link>
                </li>
                <li
                  className={`mb-2 ${
                    pathname === "/outcome" &&
                    "bg-blue-400 rounded-lg bg-opacity-10"
                  }`}
                >
                  <Link to={"/outcome"}>
                    <span className={"fa-solid fa-hand-holding-dollar"} />{" "}
                    {"Chiqim"}
                  </Link>
                </li>
                <li
                  className={`mb-2 ${
                    pathname === "/expense" &&
                    "bg-blue-400 rounded-lg bg-opacity-10"
                  }`}
                >
                  <Link to={"/expense"}>
                    <span className={"fa-solid fa-coins"} /> {"Sarf-harajat"}
                  </Link>
                </li>
                <li
                  className={`mb-2 ${
                    pathname === "/logs" &&
                    "bg-blue-400 rounded-lg bg-opacity-10"
                  }`}
                >
                  <Link to={"/logs"}>
                    <span className={"fa-solid fa-history"} />{" "}
                    {"Amallar tarixi"}
                  </Link>
                </li>
              </ul>
            </details>
            <div className="mt-auto border-t border-gray-400">
              <button
                onClick={handleLogOut}
                className="w-full bg-error rounded-lg text-white text-left py-1 px-4 mt-1"
              >
                <span className="fa-solid fa-right-from-bracket mr-2" />
                Chiqish
              </button>
            </div>
          </ul>
        </div>
      </div>
    </>
  );
};

export default index;

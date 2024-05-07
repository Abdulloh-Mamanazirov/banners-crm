import axios from "axios";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import App from "./App.jsx";

// redux
import { Provider } from "react-redux";
import { store } from "./redux";

// CSS
import "./index.css";
import "leaflet/dist/leaflet.css";
import "react-toastify/dist/ReactToastify.css";

// axios
// axios.defaults.baseURL = "https://api.abdullajonov.uz/banner-ads-backend/api";
// axios.defaults.baseURL = "http://192.168.1.105:8000/api";
axios.defaults.headers.common["Authorization"] =
  "Token " + sessionStorage.getItem("banner-token");

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
    <ToastContainer autoClose={2500} limit={3} />
  </BrowserRouter>
);

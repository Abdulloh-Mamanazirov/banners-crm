import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { BannerCard } from "../../../components";
import { updateBillboards } from "../../../redux";

const index = () => {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState();
  const dispatch = useDispatch();
  const { billboards } = useSelector((state) => state.stats);

  async function getBanners() {
    let response = await axios
      .request({
        url: "/banner/get",
        method: "get",
        params: {
          token: sessionStorage.getItem("banner-token"),
        },
      })
      .catch(async (err) => {
        if (err?.response?.data?.code === 403) {
          sessionStorage.removeItem("banner-token");
          return window.location.replace("/login");
        } else {
          await getBanners();
          toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      })
      .finally(() => setLoading(false));

    if (response?.data?.code === 200) {
      dispatch(updateBillboards(response?.data?.data?.data?.length));
      setBanners(response?.data?.data?.data);
    }
  }

  useEffect(() => {
    getBanners();
  }, [billboards]);

  return (
    <div className="relative">
      {/* <div className="mb-3">
        <h3 className="text-3xl md:text-4xl font-semibold">Search Banners:</h3>
        <div></div>
      </div> */}
      {!loading ? (
        <div className="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 items-center">
          {banners?.map?.((banner, ind) => (
            <BannerCard
              key={ind}
              data={banner}
              id={banner?.id}
              img={`https://api.abdullajonov.uz/banner-ads-backend/public/storage/banner/images/${banner?.image}`}
              title={banner?.name}
              state={banner?.is_busy}
              date={banner?.created_at?.slice(0, 10).replaceAll("-", "/")}
            />
          ))}
        </div>
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <span className="loading loading-bars loading-lg"></span>
            <p>Bannerlar yuklanmoqda...</p>
          </div>
        </div>
      )}
      {!loading && banners?.length === 0 && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <h2 className="text-5xl uppercase font-bold">Bo'sh</h2>
            <p>Bannerlar mavjud emas</p>
          </div>
        </div>
      )}
      <Link
        to="/banners/add"
        className="fixed bottom-10 right-10 max-w-[150px] p-2 flex items-center gap-3 rounded-lg bg-gradient-to-br from-base-100 to-base-300 text-lg shadow-lg hover:from-base-300 hover:to-base-100"
      >
        <span className="fa-solid fa-plus fa-2x" />
        <p>
          <span className="max-[768px]:hidden">Banner</span> Qo'shish
        </p>
      </Link>
    </div>
  );
};

export default index;

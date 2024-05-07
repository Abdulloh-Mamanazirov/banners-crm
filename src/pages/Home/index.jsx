import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Ad, Admin, User, Billboard } from "../../assets";
import { BannersMap, Stats } from "../../components";

const index = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    billboards: [],
    orders: <span className="fa-solid fa-spinner animate-spin" />,
    admins: <span className="fa-solid fa-spinner animate-spin" />,
    banners: <span className="fa-solid fa-spinner animate-spin" />,
  });

  async function getStats() {
    let response = await axios
      .get("/banners/")
      .catch((err) => {
        if (err) {
          toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      })
      .finally(() => setLoading(false));

    if (response.status === 200) {
      setStats((prev) => ({
        ...prev,
        billboards: response?.data,
      }));
    }

    let stats = await axios.get("outlays/home_page_details/").catch((err) => {
      if (err)
        toast("Statistik ma'lumotlarni olishda xato!", { type: "error" });
    });

    if (stats?.status === 200) {
      setStats((prev) => ({
        ...prev,
        orders: stats?.data?.orders,
        admins: stats?.data?.admins,
        banners: stats?.data?.banners,
      }));
    }
  }

  useEffect(() => {
    getStats();
  }, []);

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 items-center gap-3">
        <Stats img={Billboard} title="Jami Bannerlar" value={stats.banners} />
        <Stats img={Ad} title="Jami Buyurtmalar" value={stats.orders} />
        <Stats img={Admin} title="Adminlar" value={stats.admins} />
      </div>
      <div className="h-screen mt-5">
        {loading ? (
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <span className="loading loading-bars loading-lg"></span>
              <p>Bannerlar xaritasi yuklanmoqda...</p>
            </div>
          </div>
        ) : (
          <BannersMap banners={stats.billboards} />
        )}
      </div>
    </>
  );
};

export default index;

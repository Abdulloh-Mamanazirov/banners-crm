import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { BarChart, BarChartYearly } from "../../../components";

const index = () => {
  const token = sessionStorage.getItem("banner-token");
  const [btnLoading, setBtnLoading] = useState(false);
  const [banners, setBanners] = useState(false);
  const [stats, setStats] = useState({
    monthly: [],
    yearly: [],
  });

  async function getData() {
    let { data: monthly } = await axios.post(
      `/finance/${token}/monthly-outcome`
    );
    setStats((old) => ({
      ...old,
      monthly: monthly?.data,
    }));
    let { data: yearly } = await axios.post(`/finance/${token}/yearly-outcome`);
    setStats((old) => ({
      ...old,
      yearly: yearly?.data,
    }));
  }

  async function getBanners() {
    let response = await axios
      .request({
        url: "/banner/get",
        method: "get",
        params: {
          token,
        },
      })
      .catch((err) => {
        if (err) return;
      });

    if (response?.data?.code === 200) {
      return setBanners(response?.data?.data);
    }
  }

  useEffect(() => {
    getData();
    getBanners();
  }, []);

  async function handleAddOutcome(e) {
    e.preventDefault();
    setBtnLoading(true);

    let {
      banner_id,
      company_name,
      contract_start_date,
      contract_end_date,
      price,
    } = e.target;
    let data = {
      banner_id: banner_id.value,
      company_name: company_name.value,
      contract_start_date: new Date(contract_start_date.value)
        .toLocaleString("ru-Ru")
        .slice(0, 10),
      contract_end_date: new Date(contract_end_date.value)
        .toLocaleString("ru-Ru")
        .slice(0, 10),
      price: price.value,
      type: "outcome",
    };

    let response = await axios
      .post(`/finance/${token}/store`, data)
      .catch((err) => {
        if (err?.response?.status === 400) {
          return;
        } else if (err?.response?.status === 500) {
          return toast("Serverda xato!", { type: "error" });
        } else {
          return toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      })
      .finally(() => setBtnLoading(false));

    if (response.status === 200) {
      getData();
      return toast("Chiqim muvaffaqiyatli qo'shildi", {
        type: "success",
      });
    }
  }

  return (
    <>
      {/* Add new outcome */}
      <div className="mb-5">
        <h3 className="text-3xl md:text-4xl font-semibold">Chiqim qo'shish:</h3>
        <form
          onSubmit={handleAddOutcome}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 items-end"
        >
          <div>
            <label htmlFor="banner_id" className="label">
              Banner:
            </label>
            <select
              required
              name="banner_id"
              id="banner_id"
              className="w-full select select-bordered select-primary"
            >
              {banners?.map?.((banner, ind) => {
                return (
                  <option key={ind} value={banner?.id}>
                    {banner?.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label htmlFor="company_name" className="label">
              Kompaniya nomi:
            </label>
            <input
              required
              type="text"
              name="company_name"
              id="company_name"
              title="Kompaniya nomi"
              placeholder="Kompaniya nomi"
              className="w-full input input-bordered input-primary"
            />
          </div>
          <div>
            <label htmlFor="price" className="label">
              To'lov narxi:
            </label>
            <input
              required
              type="number"
              name="price"
              id="price"
              title="Narxi"
              minLength={100}
              className="w-full input input-bordered input-primary"
            />
          </div>
          <div>
            <label htmlFor="contract_start_date" className="label">
              Boshlanish sanasi:
            </label>
            <input
              required
              type="date"
              name="contract_start_date"
              id="contract_start_date"
              title="Shartnoma boshlanish sanasini kiriting"
              className="w-full input input-bordered input-primary"
            />
          </div>
          <div>
            <label htmlFor="contract_end_date" className="label">
              Tugash sanasi:
            </label>
            <input
              required
              type="date"
              name="contract_end_date"
              id="contract_end_date"
              title="Shartnoma tugash sanasini kiriting"
              className="w-full input input-bordered input-primary"
            />
          </div>
          <div className="w-full flex items-center gap-3">
            <button
              disabled={btnLoading}
              type="submit"
              className="w-9/12 btn btn-primary"
            >
              {btnLoading ? (
                <span className="fa-solid fa-spinner fa-spin-pulse" />
              ) : (
                "Yuborish"
              )}
            </button>
            <button type="reset" className="w-2/12 btn btn-error ml-2">
              <span className="fa-solid fa-arrow-rotate-left" />
            </button>
          </div>
        </form>
      </div>
      <div className="grid lg:grid-cols-2">
        <div>
          <BarChart
            title={"Chiqim"}
            color={"rgb(256,0,0)"}
            monthly={stats?.monthly}
          />
        </div>
        <div>
          <BarChartYearly
            title={"Chiqim"}
            color={"rgb(256,0,0)"}
            yearly={stats?.yearly}
          />
        </div>
      </div>
    </>
  );
};

export default index;

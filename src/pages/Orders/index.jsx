import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState, useRef } from "react";

const index = () => {
  const orderAddModal = useRef();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [data, setData] = useState({
    banners: [],
    companies: [],
  });

  async function getBanners() {
    let response = await axios.get("/banners/").catch((err) => {
      if (err) return;
    });

    if (response?.status === 200) {
      return setData((prev) => ({
        ...prev,
        banners: response?.data,
      }));
    }
  }

  useEffect(() => {
    getBanners();
  }, []);

  async function getCompanies() {
    let response = await axios.get(`/companies/`).catch((err) => {
      if (err) {
        return toast("Xatolik!", { type: "error" });
      }
    });

    if (response?.status === 200) {
      return setData((prev) => ({
        ...prev,
        companies: response?.data,
      }));
    }
  }

  useEffect(() => {
    getCompanies();
  }, []);

  async function handleAddOrder(e) {
    e.preventDefault();
    setButtonLoading(true);

    let {
      company,
      banner_id,
      start_time,
      end_time,
      side,
      price,
      order_status,
      note,
    } = e.target;
    let data = {
      company: company.value,
      banner_side: side.value,
      rent_price: price.value,
      start_date: start_time.value,
      end_date: end_time.value,
      order_status: order_status.value,
      order_note: note.value,
      banner: banner_id.value,
    };

    let response = await axios
      .post(`/orders/`, data)
      .catch((err) => {
        if (Number(err.response.status) === 500) {
          return toast("Bu banner (banner tarafi)ga buyurtma mavjud!", {
            type: "warning",
          });
        } else {
          return toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      })
      .finally(() => setButtonLoading(false));

    if (response?.status >= 200 && response?.status <= 300) {
      toast("Buyurtma qo'shildi", { type: "success" });
    }
  }

  function sortBannersByName(banners) {
    return banners.sort((a, b) => {
      const nameA = a.name;
      const nameB = b.name;

      // Check if names start with a number
      const isNumberA = /^\d/.test(nameA);
      const isNumberB = /^\d/.test(nameB);

      if (isNumberA && !isNumberB) {
        return -1;
      }
      if (!isNumberA && isNumberB) {
        return 1;
      }

      return nameA.localeCompare(nameB);
    });
  }

  return (
    <>
      <h3 className="text-2xl font-medium mb-5">Yangi buyurtma qo'shish</h3>
      {/* Add new order */}
      <form
        onSubmit={handleAddOrder}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end"
      >
        <div>
          <label htmlFor="company" className="label">
            Kompaniya:
          </label>
          <select
            required
            name="company"
            id="company"
            className="w-full select select-bordered select-primary"
          >
            <option value="" selected disabled>
              Tanlang
            </option>
            {data?.companies?.map?.((company, ind) => {
              return (
                <option key={ind} value={company?.id}>
                  {company?.name}
                </option>
              );
            })}
          </select>
        </div>
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
            <option value="" selected disabled>
              Tanlang
            </option>

            {sortBannersByName(data?.banners)?.map?.((banner, ind) => {
              return (
                <option key={ind} value={banner?.id}>
                  {banner?.name}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label htmlFor="side" className="label">
            Banner tarafi:
          </label>
          <select
            required
            name="side"
            id="side"
            className="w-full select select-bordered select-primary"
          >
            <option value="both_sides">Ikkala tarafi</option>
            <option value="front_side">Old tarafi</option>
            <option value="back_side">Orqa tarafi</option>
          </select>
        </div>
        <div>
          <label htmlFor="start" className="label">
            Boshlanish sanasi:
          </label>
          <input
            required
            type="date"
            name="start_time"
            id="start"
            className="w-full input input-bordered input-primary"
          />
        </div>
        <div>
          <label htmlFor="end" className="label">
            Tugash sanasi:
          </label>
          <input
            required
            type="date"
            name="end_time"
            id="end"
            className="w-full input input-bordered input-primary"
          />
        </div>
        <div>
          <label htmlFor="price" className="label">
            Ijara haqi / oy:
          </label>
          <input
            required
            type="number"
            name="price"
            id="price"
            title="Ijara haqi / oy"
            minLength={100}
            min={0}
            className="w-full input input-bordered input-primary"
          />
        </div>
        <div>
          <label htmlFor="order_status" className="label">
            Buyurtma xolati:
          </label>
          <select
            required
            name="order_status"
            id="order_status"
            className="w-full select select-bordered select-primary"
          >
            <option value="ongoing_rent">Davom etayotgan</option>
            <option value="planning_rent">Rejalashtirilgan</option>
            <option value="finished_rent">Tugatilgan</option>
          </select>
        </div>
        <div>
          <label htmlFor="note" className="label">
            Eslatma:
          </label>
          <textarea
            name="note"
            id="note"
            className="w-full input input-bordered input-primary"
          ></textarea>
        </div>
        <div className="w-full flex items-center gap-3">
          <button
            disabled={buttonLoading}
            type="submit"
            className="w-9/12 btn btn-primary"
          >
            {buttonLoading ? (
              <span className="fa-solid fa-spinner fa-spin-pulse" />
            ) : (
              "Yuborish"
            )}
          </button>
          <button
            onClick={() => orderAddModal.current.close()}
            type="reset"
            className="w-2/12 btn btn-error ml-2"
          >
            <span className="fa-solid fa-close" />
          </button>
        </div>
      </form>
    </>
  );
};

export default index;

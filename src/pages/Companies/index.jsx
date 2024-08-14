import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";

const index = () => {
  const companyAddModal = useRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  async function getCompanies() {
    const response = await axios
      .get(`/companies/`)
      .catch((err) => {
        if (err) {
          return toast("Xatolik!", { type: "error" });
        }
      })
      .finally(() => setLoading(false));

    if (response?.status === 200) {
      return setData(response?.data);
    }
  }

  useEffect(() => {
    getCompanies();
  }, []);

  async function handleAddOrder(e) {
    e.preventDefault();
    setButtonLoading(true);

    const { phone, name, decription } = e.target;
    const data = {
      name: name.value,
      phone_number: phone.value,
      decription: decription.value,
    };

    const response = await axios
      .post(`/companies/`, data)
      .catch((err) => {
        if (err) {
          return toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      })
      .finally(() => setButtonLoading(false));

    if (response?.status === 201) {
      getCompanies();
      companyAddModal.current.close();
      toast("Kompaniya qo'shildi", { type: "success" });
    }
  }

  return (
    <div>
      {loading && (
        <div className="text-center">
          <span className="loading loading-bars loading-lg" />
          <p>Kompaniyalar yuklanmoqda...</p>
        </div>
      )}

      {/* companies */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {!loading &&
          data?.map((item, ind) => (
            <div
              key={ind}
              title={item?.description}
              className="relative bg-white border rounded-lg p-3 shadow-lg"
            >
              <p className="text-lg font-medium">{item?.name}</p>
              <hr className="my-2" />
              <p>{item?.phone_number}</p>
              {item?.description && (
                <span
                  className="absolute bg-cov inset-0 tooltip tooltip-bottom normal-case"
                  data-tip={item?.description}
                />
              )}
            </div>
          ))}
      </div>

      {/* Button to open add company modal */}
      <button
        onClick={() => companyAddModal.current.showModal()}
        className="w-16 h-16 btn btn-primary rounded-full fixed bottom-10 right-10"
      >
        <span
          className="absolute bg-cov inset-0 tooltip tooltip-left normal-case"
          data-tip="Yangi Kompaniya"
        />
        <span className="fa-solid fa-plus fa-xl" />
      </button>

      {/* Add new company modal */}
      <dialog
        ref={companyAddModal}
        className="backdrop:bg-black/20 p-3 rounded-xl w-full md:w-2/3"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl md:text-3xl font-semibold">
            Yangi kompaniya qo'shish:
          </h3>
          <button
            onClick={() => companyAddModal.current.close()}
            className="w-8 h-8 mr-3 rounded-full border"
          >
            <span className="fa-solid fa-close" />
          </button>
        </div>
        <form
          onSubmit={handleAddOrder}
          className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end"
        >
          <div>
            <label htmlFor="name" className="label">
              Kompaniya nomi:
            </label>
            <input
              required
              type="text"
              name="name"
              id="name"
              title="Kompaniya nomi"
              className="w-full input input-bordered input-primary"
            />
          </div>
          <div>
            <label htmlFor="phone" className="label">
              Tel raqam:
            </label>
            <input
              required
              type="text"
              name="phone"
              id="phone"
              title="Telefon raqam"
              className="w-full input input-bordered input-primary"
            />
          </div>
          <div>
            <label htmlFor="description" className="label">
              Izoh:
            </label>
            <textarea
              name="description"
              id="description"
              className="w-full input input-bordered input-primary"
            ></textarea>
          </div>
          <div className="w-full flex items-center gap-3 mb-1.5">
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
              onClick={() => companyAddModal.current.close()}
              type="reset"
              className="w-2/12 btn btn-error ml-2"
            >
              <span className="fa-solid fa-close" />
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default index;

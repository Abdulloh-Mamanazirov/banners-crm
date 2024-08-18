import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";

const Table = () => {
  const paymentModal = useRef();
  const { id } = useParams();
  const { state } = useLocation();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const months = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];

  async function getData() {
    let response = await axios
      .get(`/orders/detailed_orders/${id}/`)
      .catch((err) => {
        if (err) {
          return toast("Xatolik!", { type: "error" });
        }
      })
      .finally(() => setLoading(false));

    if (response?.status === 200) {
      return setData(response?.data["1"]);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  async function handlePayment(e) {
    e.preventDefault();
    setButtonLoading(true);

    const { amount } = e.target;

    const data = {
      client: id,
      payment_amount: amount.value,
    };

    let response = await axios
      .post(`/payments/`, data)
      .catch((err) => {
        if (err) {
          return toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      })
      .finally(() => setButtonLoading(false));

    if (response.status === 201) {
      getData();
      paymentModal.current.close();
      e.target.reset();
      return toast("To'lov qilindi", {
        type: "success",
      });
    }
  }

  return (
    <div>
      <div className="mb-10">
        <h3 className="text-2xl font-medium mb-5">Buyurtma ma'lumotlari</h3>
        <table className="table table-pin-rows table-xs md:table-md">
          <thead>
            <tr className="bg-base-200 md:text-sm">
              <th>Banner</th>
              <th>Buyurtmachi</th>
              <th>Jami to'lanishi kerak</th>
              <th>To'langan</th>
              <th>Boshlanish vaqti</th>
              <th>Tugash vaqti</th>
              <th>Status</th>
              <th>Yaratilgan sana</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <p className="whitespace-nowrap">{state?.banner_name}</p>
                <p>
                  (
                  {state?.banner_side === "both_sides"
                    ? "Ikkala tomon"
                    : state?.banner_side === "front_side"
                    ? "Old tomon"
                    : state?.banner_side === "back_side"
                    ? "Orqa tomon"
                    : ""}
                  )
                </p>
              </td>
              <td>{state?.company}</td>
              <td>
                {Number(state?.full_payment ?? 0).toLocaleString("uz-Uz")}
              </td>
              <td>
                {Number(state?.paid_payment ?? 0).toLocaleString("uz-Uz")}
              </td>
              <td>{state?.start_date.slice(0, 16).replace("T", " ")}</td>
              <td>{state?.end_date.slice(0, 16).replace("T", " ")}</td>
              <td>
                {state?.order_status === "ongoing_rent"
                  ? "Davom et."
                  : state?.order_status === "finished_rent"
                  ? "Tugatilgan"
                  : state?.order_status === "planning_rent"
                  ? "Rejada"
                  : ""}
              </td>
              <td>{state?.created_date.slice(0, 10)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-2xl font-medium mb-5">
          To'lovlar jadvali ({state.monthly_payment} oy uchun)
        </h3>

        {/* payment table */}
        <div className="relative overflow-auto max-h-[90vh] max-w-[96vw]">
          {loading ? (
            <div className="text-center">
              <span className="loading loading-bars loading-lg" />
              <p>To'lovlar yuklanmoqda...</p>
            </div>
          ) : (
            <table className="table table-pin-rows table-xs md:table-md">
              <thead>
                <tr>
                  <th className="bg-gray-200">Year</th>
                  {months.map((month, index) => (
                    <th key={index} className="bg-gray-200">
                      {month}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(data).map(([year, values]) => (
                  <tr key={year}>
                    <td className="bg-gray-200">{year}</td>
                    {values.map((value, index) => (
                      <td
                        className={`${
                          value === -1 && "bg-gray-500 select-none text-white"
                        }`}
                        key={index}
                      >
                        {value === -1
                          ? "-"
                          : Number(value).toLocaleString("uz-Uz")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add order button */}
      <button
        onClick={() => paymentModal.current.showModal()}
        className="w-16 h-16 btn btn-primary rounded-full fixed bottom-10 right-10"
      >
        <span
          className="absolute bg-cov inset-0 tooltip tooltip-left normal-case"
          data-tip="To'lov qilish"
        />
        <span className="fa-solid fa-money-bills fa-xl" />
      </button>

      {/* Add new order modal */}
      <dialog
        ref={paymentModal}
        className="backdrop:bg-black/20 p-3 rounded-xl w-full md:w-1/2"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl md:text-2xl font-semibold">To'lov qilish:</h3>
          <button
            onClick={() => paymentModal.current.close()}
            className="w-8 h-8 mr-3 rounded-full border"
          >
            <span className="fa-solid fa-close" />
          </button>
        </div>
        <form
          onSubmit={handlePayment}
          className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end"
        >
          <div>
            <label htmlFor="amount" className="label">
              To'lov:
            </label>
            <input
              required
              name="amount"
              id="amount"
              className="w-full input input-bordered input-primary"
            />
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
              onClick={() => paymentModal.current.close()}
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

export default Table;

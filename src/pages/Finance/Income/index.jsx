import axios from "axios";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { BarChartYearly } from "../../../components";
import BarChart from "./BarChart";

const index = () => {
  const [year, setYear] = useState(2024);
  const [btnLoading, setBtnLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [companies, setCompanies] = useState(null);
  const [stats, setStats] = useState({
    monthly: [],
    payments: [],
  });

  async function getData() {
    let { data: monthly } = await axios.get(`/orders/monthly_income/${year}/`);
    setStats((old) => ({
      ...old,
      monthly: monthly,
    }));

    let { data: payments } = await axios
      .get(`/payments/`)
      .finally(() => setListLoading(false));
    setStats((old) => ({
      ...old,
      payments: payments,
    }));
  }

  async function getCompanies() {
    let response = await axios.get(`/companies/`).catch((err) => {
      if (err) return;
    });

    if (response?.status === 200) {
      return setCompanies(response?.data);
    }
  }

  useEffect(() => {
    getData();
  }, [year]);

  useEffect(() => {
    getCompanies();
  }, []);

  async function handleAddIncome(e) {
    e.preventDefault();
    setBtnLoading(true);

    let { client, amount } = e.target;

    let data = {
      payment_amount: amount.value,
      client: client.value,
    };

    let response = await axios
      .post(`/payments/`, data)
      .catch((err) => {
        if (err) {
          return toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      })
      .finally(() => setBtnLoading(false));

    if (response.status === 201) {
      getData();
      return toast("Kirim muvaffaqiyatli qo'shildi", {
        type: "success",
      });
    }
  }

  async function handleDeleteIncome(id) {
    let response = await axios.delete(`/payments/${id}/`).catch((err) => {
      if (err) toast("Nimadadir xatolik ketdi!", { type: "error" });
    });
    if (response.status === 204) {
      toast("To'lov o'chirildi", { type: "info" });
      return getData();
    }
  }

  return (
    <>
      {/* Add new income */}
      <div className="mb-5">
        <h3 className="text-3xl md:text-4xl font-semibold">Kirim qo'shish:</h3>
        <form
          onSubmit={handleAddIncome}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 items-end"
        >
          <div>
            <label htmlFor="client" className="label">
              Kompaniya:
            </label>
            <select
              required
              name="client"
              id="client"
              className="w-full select select-bordered select-primary"
            >
              <option value="" selected disabled>
                Tanlang
              </option>
              {companies?.map?.((company, ind) => {
                return (
                  <option key={ind} value={company?.id}>
                    {company?.name}
                  </option>
                );
              })}
            </select>
          </div>
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

      {/* year filter */}
      <div className="flex items-center gap-2">
        <label htmlFor="year">Filter:</label>
        <input
          name="year"
          id="year"
          className="border rounded-md py-1 px-2"
          type="number"
          min="2022"
          step="1"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>

      <div className="grid lg:grid-cols-2">
        <div>
          <BarChart
            title={"to'lanishi kerak bo'lgan summa"}
            color={"rgb(50, 153, 249)"}
            monthly={stats?.monthly}
          />
        </div>
        <div>
          <BarChartYearly
            title={"to'langan summa"}
            color={"rgb(50, 153, 249)"}
            yearly={stats?.monthly}
          />
        </div>
      </div>
      {/* payments list */}
      <div className="mt-10 relative overflow-auto max-h-[90vh] max-w-[88vw]">
        {listLoading ? (
          <div className="text-center">
            <span className="loading loading-bars loading-lg" />
            <p>To'lovlar yuklanmoqda...</p>
          </div>
        ) : (
          <>
            <table className="w-full table table-pin-rows table-xs md:table-md">
              <thead>
                <tr className="bg-base-200 md:text-sm">
                  <th>#</th>
                  <th>Buyurtmachi</th>
                  <th>Qiymat</th>
                  <th>Qo'shilgan sana</th>
                  <th>Qo'shgan admin</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {stats?.payments?.length === 0 && (
                  <tr className="text-center">
                    <td colSpan={6} className="text-center">
                      <h2 className="text-5xl uppercase font-bold">
                        Bo'm bo'sh
                      </h2>
                      <p>To'lovlar tarixi mavjud emas</p>
                    </td>
                  </tr>
                )}
                {stats?.payments?.map?.((payment, ind) => (
                  <tr className="hover" key={ind}>
                    <th>{ind + 1}</th>
                    <td>
                      {orders?.map?.(
                        (order) =>
                          order?.id === payment?.client && order?.company
                      )}
                    </td>
                    <td>
                      {Number(payment?.payment_amount).toLocaleString("uz-Uz")}
                    </td>
                    <td>{payment?.created_date.slice(0, 10)}</td>
                    <td>{payment?.admin?.full_name}</td>
                    <td>
                      {/* <button
                        className="tooltip tooltip-info btn btn-info btn-xs md:btn-sm mr-3 text-white normal-case my-2 md:my-0"
                        data-tip="Tahrirlash"
                        onClick={() => {
                          setOrderInfo(payment);
                          orderEditModal.current.showModal();
                        }}
                      >
                        <span className="fa-solid fa-edit" />
                      </button> */}
                      <button
                        onClick={() => handleDeleteIncome(payment?.id)}
                        className="tooltip tooltip-error btn btn-error btn-xs md:btn-sm mr-3 text-white normal-case"
                        data-tip="O'chirish"
                      >
                        <span className="fa-solid fa-trash-can" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
};

export default index;

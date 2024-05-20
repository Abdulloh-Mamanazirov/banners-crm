import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { BarChart, BarChartYearly } from "../../../components";

const index = () => {
  const [expenses, setExpenses] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [stats, setStats] = useState({
    monthly: [],
    outcome: [],
  });

  async function getData() {
    let { data: monthly } = await axios.get(`/bruhs/monthly_income/`);
    setStats((old) => ({
      ...old,
      monthly: monthly,
    }));

    let { data: outcome } = await axios
      .get(`/outlays/`)
      .finally(() => setListLoading(false));
    setStats((old) => ({
      ...old,
      outcome: outcome,
    }));
  }

  async function getExpenses() {
    let response = await axios.get(`/bruhs/`).catch((err) => {
      if (err) return;
    });
    if (response?.status === 200) {
      return setExpenses(response?.data);
    }
  }

  useEffect(() => {
    getData();
    getExpenses();
  }, []);

  async function handleAddOutcome(e) {
    e.preventDefault();
    setBtnLoading(true);

    let { bruh, amount } = e.target;
    let data = {
      bruh: bruh.value,
      outlay_amount: amount.value,
    };

    let response = await axios
      .post(`/outlays/`, data)
      .catch((err) => {
        if (err) {
          return toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      })
      .finally(() => setBtnLoading(false));

    if (response.status === 201) {
      getData();
      return toast("Chiqim muvaffaqiyatli qo'shildi", {
        type: "success",
      });
    }
  }

  async function handleDeleteOutcome(id) {
    let response = await axios.delete(`/outlays/${id}/`).catch((err) => {
      if (err) toast("Nimadadir xatolik ketdi!", { type: "error" });
    });
    if (response.status === 204) {
      toast("Chiqim o'chirildi", { type: "info" });
      return getData();
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
            <label htmlFor="bruh" className="label">
              Chiqim:
            </label>
            <select
              required
              name="bruh"
              id="bruh"
              className="w-full select select-bordered select-primary"
            >
              {expenses?.map?.((item, ind) => {
                return (
                  <option key={ind} value={item?.id}>
                    {item?.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label htmlFor="amount" className="label">
              Chiqim summasi:
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
            color={"darkred"}
            yearly={stats?.monthly}
          />
        </div>
      </div>
      {/* payments list */}
      <div className="mt-10 relative overflow-auto max-h-[90vh] max-w-[88vw]">
        {listLoading ? (
          <div className="text-center">
            <span className="loading loading-bars loading-lg" />
            <p>Chiqimlar yuklanmoqda...</p>
          </div>
        ) : (
          <>
            <table className="w-full table table-pin-rows table-xs md:table-md">
              <thead>
                <tr className="bg-base-200 md:text-sm">
                  <th>#</th>
                  <th>Chiqim miqdori</th>
                  <th>Sarflangan</th>
                  <th>Qo'shgan admin</th>
                  <th>Sana</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {stats?.outcome?.length === 0 && (
                  <tr className="text-center">
                    <td colSpan={6} className="text-center">
                      <h2 className="text-5xl uppercase font-bold">
                        Bo'm bo'sh
                      </h2>
                      <p>Chiqim tarixi mavjud emas</p>
                    </td>
                  </tr>
                )}
                {stats?.outcome?.map?.((outcome, ind) => (
                  <tr className="hover" key={ind}>
                    <th>{ind + 1}</th>
                    <td>{outcome?.outlay_amount}</td>
                    <td>{outcome?.bruh?.name}</td>
                    <td>{outcome?.admin?.full_name}</td>
                    <td>{outcome?.created_date.slice(0, 10)}</td>
                    <td>
                      {/* <button
                        className="tooltip tooltip-info btn btn-info btn-xs md:btn-sm mr-3 text-white normal-case my-2 md:my-0"
                        data-tip="Tahrirlash"
                        onClick={() => {
                          setOrderInfo(outcome);
                          orderEditModal.current.showModal();
                        }}
                      >
                        <span className="fa-solid fa-edit" />
                      </button> */}
                      <button
                        onClick={() => handleDeleteOutcome(outcome?.id)}
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

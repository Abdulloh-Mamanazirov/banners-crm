import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

const index = () => {
  const orderEditModal = useRef();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [orderInfo, setOrderInfo] = useState();
  const [data, setData] = useState(null);

  async function getData() {
    let response = await axios
      .get(`/bruhs/`)
      .catch((err) => {
        if (err) {
          return toast("Xatolik!", { type: "error" });
        }
      })
      .finally(() => setListLoading(false));

    if (response?.status === 200) {
      return setData(response?.data);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  async function handleAddExpense(e) {
    e.preventDefault();
    setButtonLoading(true);

    let { number, name, start_time, end_time, price, note } = e.target;
    let data = {
      name: name.value,
      number: number.value,
      start_date: start_time.value,
      end_date: end_time.value,
      rent_price: price.value,
      bruh_note: note.value,
    };

    let response = await axios
      .post(`/bruhs/`, data)
      .catch((err) => {
        if (err) {
          return toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      })
      .finally(() => setButtonLoading(false));

    if (response?.status === 201) {
      getData();
      toast("Chiqim qo'shildi", { type: "success" });
    }
  }

  async function handleUpdateExpense(e) {
    e.preventDefault();

    let { number, name, start_time, end_time, price, note } = e.target;
    let data = {
      name: name.value,
      number: number.value,
      start_date: start_time.value,
      end_date: end_time.value,
      rent_price: price.value,
      bruh_note: note.value,
    };

    let cleanedObj = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => !!value)
    );

    let response = await axios
      .patch(`/bruhs/${orderInfo?.id}/`, cleanedObj)
      .catch((err) => {
        if (err) {
          return toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      });

    if (response?.status === 200) {
      getData();
      orderEditModal.current.close();
      return toast("Chiqim tahrirlandi!", { type: "info" });
    }
  }

  async function handleDeleteExpense(id) {
    let response = await axios.delete(`/bruhs/${id}/`).catch((err) => {
      if (err) toast("Nimadadir xatolik ketdi!", { type: "error" });
    });
    if (response.status === 204) {
      toast("Chiqim o'chirildi", { type: "info" });
      return getData();
    }
  }

  return (
    <>
      {/* Add new expense */}
      <div className="mb-5">
        <h3 className="text-3xl md:text-4xl font-semibold">Chiqim qo'shish:</h3>
        <form
          onSubmit={handleAddExpense}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 items-end"
        >
          <div>
            <label htmlFor="name" className="label">
              Nomi:
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
            <label htmlFor="number" className="label">
              Hisob / Tel raqam:
            </label>
            <input
              required
              type="text"
              name="number"
              id="number"
              title="Telefon raqam"
              className="w-full input input-bordered input-primary"
            />
          </div>
          <div>
            <label htmlFor="price" className="label">
              To'lov miqdori:
            </label>
            <input
              required
              type="number"
              name="price"
              id="price"
              title="To'lov miqdori"
              minLength={100}
              min={0}
              className="w-full input input-bordered input-primary"
            />
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
            <button type="reset" className="w-2/12 btn btn-error ml-2">
              <span className="fa-solid fa-arrow-rotate-left" />
            </button>
          </div>
        </form>
      </div>

      {/* Expense table */}
      <div className="relative overflow-auto max-h-[90vh] max-w-[88vw]">
        {listLoading ? (
          <div className="text-center">
            <span className="loading loading-bars loading-lg" />
            <p>Chiqimlar yuklanmoqda...</p>
          </div>
        ) : (
          <>
            <table className="table table-pin-rows table-xs md:table-md">
              <thead>
                <tr className="bg-base-200 md:text-sm">
                  <th>#</th>
                  <th>Nomi</th>
                  <th>Raqam</th>
                  <th>Davomiyligi</th>
                  <th>Chiqim miqdori</th>
                  <th>Jami to'lanishi kerak</th>
                  <th>To'langan</th>
                  <th>Yaratilgan sana</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data?.length === 0 && (
                  <tr className="text-center">
                    <td colSpan={6} className="text-center">
                      <h2 className="text-5xl uppercase font-bold">
                        Bo'm bo'sh
                      </h2>
                      <p>Buyurtmalar mavjud emas</p>
                    </td>
                  </tr>
                )}
                {data?.map?.((item, ind) => (
                  <tr className="hover" key={ind}>
                    <th>{ind + 1}</th>
                    <td>{item?.name}</td>
                    <td>{item?.number}</td>
                    <td className="text-center">
                      <p>{item?.start_date.slice(0, 16).replace("T", " ")}</p>
                      <p>---</p>
                      <p>{item?.end_date.slice(0, 16).replace("T", " ")}</p>
                    </td>
                    <td>{item?.rent_price}</td>
                    <td>{item?.full_payment}</td>
                    <td>{item?.paid_payment}</td>
                    <td>{item?.created_date.slice(0, 10)}</td>
                    <td>
                      <button
                        className="tooltip tooltip-info btn btn-info btn-xs md:btn-sm mr-3 text-white normal-case my-2 md:my-0"
                        data-tip="Tahrirlash"
                        onClick={() => {
                          setOrderInfo(item);
                          orderEditModal.current.showModal();
                        }}
                      >
                        <span className="fa-solid fa-edit" />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(item?.id)}
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

      {/* Expense edit modal */}
      <dialog
        ref={orderEditModal}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Tahrirlash</h3>
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-5 top-5">
              ✕
            </button>
          </form>
          <form onSubmit={handleUpdateExpense}>
            <table className="table">
              <tbody>
                <tr>
                  <th>Nomi:</th>
                  <td>
                    <input
                      type="name"
                      name="name"
                      className="w-full input input-bordered input-accent input-sm"
                      defaultValue={orderInfo?.name}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Hisob / Tel raqam:</th>
                  <td>
                    <input
                      type="number"
                      name="number"
                      className="w-full input input-bordered input-accent input-sm"
                      defaultValue={orderInfo?.number}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Boshlanish sanasi:</th>
                  <td>
                    <input
                      type="date"
                      name="start_time"
                      id="start"
                      className="w-full input input-bordered input-accent input-sm"
                      defaultValue={orderInfo?.start_time}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Tugash sanasi:</th>
                  <td>
                    <input
                      type="date"
                      name="end_time"
                      id="end"
                      className="w-full input input-bordered input-accent input-sm"
                      defaultValue={orderInfo?.end_time}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Miqdori :</th>
                  <td>
                    <input
                      type="price"
                      name="price"
                      className="w-full input input-bordered input-accent input-sm"
                      defaultValue={orderInfo?.rent_price}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Eslatma:</th>
                  <textarea
                    name="note"
                    id="note"
                    className="w-full input input-bordered input-accent"
                    rows={5}
                    defaultValue={orderInfo?.order_note}
                  ></textarea>
                </tr>
                <tr>
                  <td>
                    <button
                      type="submit"
                      className="btn btn-success btn-sm w-full"
                    >
                      Yuborish
                    </button>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </form>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn border btn-sm border-gray-400">
                Yopish
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default index;

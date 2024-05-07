import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const index = () => {
  const orderEditModal = useRef();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [orderInfo, setOrderInfo] = useState();
  const [data, setData] = useState({
    orders: [],
    banners: [],
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

  async function getOrders() {
    let response = await axios
      .get(`/orders/`)
      .catch((err) => {
        if (err) {
          return toast("Xatolik!", { type: "error" });
        }
      })
      .finally(() => setListLoading(false));

    if (response?.status === 200) {
      return setData((prev) => ({
        ...prev,
        orders: response?.data,
      }));
    }
  }

  useEffect(() => {
    getBanners();
    getOrders();
  }, []);

  async function handleAddOrder(e) {
    e.preventDefault();
    setButtonLoading(true);

    let {
      phone,
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
      phone_number: phone.value,
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
        if (err) {
          return toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      })
      .finally(() => setButtonLoading(false));

    if (response?.status === 201) {
      getOrders();
      toast("Buyurtma qo'shildi", { type: "success" });
    }
  }

  async function handleUpdateOrder(e) {
    e.preventDefault();

    let {
      phone,
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
      phone_number: phone.value,
      banner_side: side.value,
      rent_price: price.value,
      start_date: start_time.value,
      end_date: end_time.value,
      order_status: order_status.value,
      order_note: note.value,
      banner: banner_id.value,
    };

    let cleanedObj = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => !!value)
    );

    let response = await axios
      .patch(`/orders/${orderInfo?.id}/`, cleanedObj)
      .catch((err) => {
        if (err) {
          return toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      });

    if (response?.status === 200) {
      getOrders();
      orderEditModal.current.close();
      return toast("Buyurtma tahrirlandi!", { type: "info" });
    }
  }

  async function handleDeleteOrder(id) {
    let response = await axios.delete(`/orders/${id}/`).catch((err) => {
      if (err) toast("Nimadadir xatolik ketdi!", { type: "error" });
    });
    if (response.status === 204) {
      toast("Buyurtma o'chirildi", { type: "info" });
      return getOrders();
    }
  }

  return (
    <>
      {/* Add new order */}
      <div className="mb-5">
        <h3 className="text-3xl md:text-4xl font-semibold">
          Yangi buyurtma qo'shish:
        </h3>
        <form
          onSubmit={handleAddOrder}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 items-end"
        >
          <div>
            <label htmlFor="company" className="label">
              Kompaniya:
            </label>
            <input
              required
              type="text"
              name="company"
              id="company"
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
            <label htmlFor="banner_id" className="label">
              Banner:
            </label>
            <select
              required
              name="banner_id"
              id="banner_id"
              className="w-full select select-bordered select-primary"
            >
              {data?.banners?.map?.((banner, ind) => {
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
            <button type="reset" className="w-2/12 btn btn-error ml-2">
              <span className="fa-solid fa-arrow-rotate-left" />
            </button>
          </div>
        </form>
      </div>

      {/* Orders table */}
      <div className="relative overflow-auto max-h-[90vh] max-w-[88vw]">
        {listLoading ? (
          <div className="text-center">
            <span className="loading loading-bars loading-lg" />
            <p>Buyurtmalar yuklanmoqda...</p>
          </div>
        ) : (
          <>
            <table className="table table-pin-rows table-xs md:table-md">
              <thead>
                <tr className="bg-base-200 md:text-sm">
                  <th>#</th>
                  <th>Banner</th>
                  <th>Buyurtmachi</th>
                  <th>Yaratilgan sana</th>
                  <th>Boshlanish vaqti</th>
                  <th>Tugash vaqti</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data?.orders?.length === 0 && (
                  <tr className="text-center">
                    <td colSpan={6} className="text-center">
                      <h2 className="text-5xl uppercase font-bold">
                        Bo'm bo'sh
                      </h2>
                      <p>Buyurtmalar mavjud emas</p>
                    </td>
                  </tr>
                )}
                {data?.orders?.map?.((order, ind) => (
                  <tr className="hover" key={ind}>
                    <th>{ind + 1}</th>
                    <td>
                      <p className="whitespace-nowrap">
                        {data?.banners?.map?.((b) => {
                          if (b.id == order.banner) return <>{b?.name}</>;
                        })}
                      </p>
                      <p>
                        (
                        {order?.banner_side === "both_sides"
                          ? "Ikkala tomon"
                          : order?.banner_side === "front_side"
                          ? "Old tomon"
                          : order?.banner_side === "back_side"
                          ? "Orqa tomon"
                          : ""}
                        )
                      </p>
                    </td>
                    <td>{order?.company}</td>
                    <td>{order?.created_date.slice(0, 10)}</td>
                    <td>{order?.start_date.slice(0, 16).replace("T", " ")}</td>
                    <td>{order?.end_date.slice(0, 16).replace("T", " ")}</td>
                    <td>
                      <button
                        className="tooltip tooltip-info btn btn-info btn-xs md:btn-sm mr-3 text-white normal-case my-2 md:my-0"
                        data-tip="Tahrirlash"
                        onClick={() => {
                          setOrderInfo(order);
                          orderEditModal.current.showModal();
                        }}
                      >
                        <span className="fa-solid fa-edit" />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order?.id)}
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

      {/* Order edit modal */}
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
          <form onSubmit={handleUpdateOrder}>
            <table className="table">
              <tbody>
                <tr>
                  <th>Buyurtmachi:</th>
                  <td>
                    <input
                      type="company"
                      name="company"
                      className="w-full input input-bordered input-accent input-sm"
                      defaultValue={orderInfo?.company}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Tel:</th>
                  <td>
                    <input
                      type="phone"
                      name="phone"
                      className="w-full input input-bordered input-accent input-sm"
                      defaultValue={orderInfo?.phone_number}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Banner:</th>
                  <td>
                    <select
                      name="banner_id"
                      id="banner_id"
                      className="w-full select select-bordered select-accent select-sm"
                      defaultValue={orderInfo?.banner}
                    >
                      {data?.banners?.map?.((banner, ind) => {
                        return (
                          <option key={ind} value={banner?.id}>
                            {banner?.name}
                          </option>
                        );
                      })}
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Banner tarafi:</th>
                  <td>
                    <select
                      name="side"
                      id="side"
                      className="w-full select select-bordered select-accent select-sm"
                      defaultValue={orderInfo?.banner_side}
                    >
                      <option value="both_sides">Ikkala tarafi</option>
                      <option value="front_side">Old tarafi</option>
                      <option value="back_side">Orqa tarafi</option>
                    </select>
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
                  <th>Ijara haqi/oy :</th>
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
                  <th>Buyurtma xolati:</th>
                  <select
                    name="order_status"
                    id="order_status"
                    className="w-full select select-bordered select-accent select-sm"
                    defaultValue={orderInfo?.order_status}
                  >
                    <option value="ongoing_rent">Davom etayotgan</option>
                    <option value="planning_rent">Rejalashtirilgan</option>
                    <option value="finished_rent">Tugatilgan</option>
                  </select>
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

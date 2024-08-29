import axios from "axios";
import { toast } from "react-toastify";
import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const index = () => {
  const navigate = useNavigate();
  const orderAddModal = useRef();
  const orderEditModal = useRef();
  const { name } = useParams();
  const { state } = useLocation();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [orderInfo, setOrderInfo] = useState();
  const [banners, setBanners] = useState([]);

  async function getBanners() {
    let response = await axios.get("/banners/").catch((err) => {
      if (err) return;
    });

    if (response?.status === 200) {
      return setBanners(response?.data);
    }
  }

  async function getData() {
    let response = await axios
      .get(`/orders/?company=${name}`)
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
    getBanners();
    getData();
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
      getData();
      orderAddModal.current.close();
      toast("Buyurtma qo'shildi", { type: "success" });
    }
  }

  async function handleUpdateOrder(e) {
    e.preventDefault();

    let fullData = orderInfo;

    let {
      // phone,
      // company,
      banner_id,
      start_time,
      end_time,
      side,
      price,
      order_status,
      note,
    } = e.target;
    let data = {
      // company: company.value,
      // phone_number: phone.value,
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

    Object.entries(cleanedObj).forEach(([name, value]) => {
      fullData[name] = value;
    });

    let response = await axios
      .patch(`/orders/${orderInfo?.id}/`, fullData)
      .catch((err) => {
        if (err) {
          return toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      });

    if (response?.status === 200) {
      getData();
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
      return getData();
    }
  }

  return (
    <div>
      <h3 className="text-2xl font-medium mb-5">Buyurtmalar jadvali</h3>
      {/* Orders table */}
      <div className="relative overflow-auto max-h-[90vh] max-w-[96vw]">
        {loading ? (
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
                  <th>Jami to'lanishi kerak</th>
                  <th>To'langan</th>
                  <th>Yaratilgan sana</th>
                  <th>Boshlanish vaqti</th>
                  <th>Tugash vaqti</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data?.length === 0 && (
                  <tr className="text-center">
                    <td colSpan={8} className="text-center">
                      <h2 className="text-5xl uppercase font-bold">
                        Bo'm bo'sh
                      </h2>
                      <p>Buyurtmalar mavjud emas</p>
                    </td>
                  </tr>
                )}
                {data?.map?.((order, ind) => (
                  <tr className="hover cursor-pointer" key={ind}>
                    <th
                      onClick={() =>
                        navigate(`/orders/payment/${order.id}`, {
                          state: {
                            banner_name: banners?.filter(
                              (i) => i.id == order.banner
                            )?.[0]?.name,
                            ...order,
                          },
                        })
                      }
                    >
                      {ind + 1}
                    </th>
                    <td
                      onClick={() =>
                        navigate(`/orders/payment/${order.id}`, {
                          state: {
                            banner_name: banners?.filter(
                              (i) => i.id == order.banner
                            )?.[0]?.name,
                            ...order,
                          },
                        })
                      }
                    >
                      <p className="whitespace-nowrap">
                        {banners?.map?.((b) => {
                          if (b.id == order.banner)
                            return <p key={b.id}>{b?.name}</p>;
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
                    <td
                      onClick={() =>
                        navigate(`/orders/payment/${order.id}`, {
                          state: {
                            banner_name: banners?.filter(
                              (i) => i.id == order.banner
                            )?.[0]?.name,
                            ...order,
                          },
                        })
                      }
                    >
                      {state?.name}
                    </td>
                    <td
                      onClick={() =>
                        navigate(`/orders/payment/${order.id}`, {
                          state: {
                            banner_name: banners?.filter(
                              (i) => i.id == order.banner
                            )?.[0]?.name,
                            ...order,
                          },
                        })
                      }
                    >
                      {Number(order?.full_payment ?? 0).toLocaleString("uz-Uz")}
                    </td>
                    <td
                      onClick={() =>
                        navigate(`/orders/payment/${order.id}`, {
                          state: {
                            banner_name: banners?.filter(
                              (i) => i.id == order.banner
                            )?.[0]?.name,
                            ...order,
                          },
                        })
                      }
                    >
                      {Number(order?.paid_payment ?? 0).toLocaleString("uz-Uz")}
                    </td>
                    <td
                      onClick={() =>
                        navigate(`/orders/payment/${order.id}`, {
                          state: {
                            banner_name: banners?.filter(
                              (i) => i.id == order.banner
                            )?.[0]?.name,
                            ...order,
                          },
                        })
                      }
                    >
                      {order?.created_date.slice(0, 10)}
                    </td>
                    <td
                      onClick={() =>
                        navigate(`/orders/payment/${order.id}`, {
                          state: {
                            banner_name: banners?.filter(
                              (i) => i.id == order.banner
                            )?.[0]?.name,
                            ...order,
                          },
                        })
                      }
                    >
                      {order?.start_date.slice(0, 16).replace("T", " ")}
                    </td>
                    <td
                      onClick={() =>
                        navigate(`/orders/payment/${order.id}`, {
                          state: {
                            banner_name: banners?.filter(
                              (i) => i.id == order.banner
                            )?.[0]?.name,
                            ...order,
                          },
                        })
                      }
                    >
                      {order?.end_date.slice(0, 16).replace("T", " ")}
                    </td>
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

      {/* Add order button */}
      <button
        onClick={() => orderAddModal.current.showModal()}
        className="w-16 h-16 btn btn-primary rounded-full fixed bottom-10 right-10"
      >
        <span
          className="absolute bg-cov inset-0 tooltip tooltip-left normal-case"
          data-tip="Yangi buyurtma"
        />
        <span className="fa-solid fa-plus fa-xl" />
      </button>

      {/* Add new order modal */}
      <dialog
        ref={orderAddModal}
        className="backdrop:bg-black/20 p-3 rounded-xl w-full md:w-2/3"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl md:text-3xl font-semibold">
            Yangi buyurtma qo'shish:
          </h3>
          <button
            onClick={() => orderAddModal.current.close()}
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
            <label htmlFor="company" className="label">
              Kompaniya:
            </label>
            <input
              required
              readOnly
              value={name}
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
      </dialog>

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
                {/* <tr>
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
                </tr> */}
                <tr>
                  <th>Banner:</th>
                  <td>
                    <select
                      name="banner_id"
                      id="banner_id"
                      className="w-full select select-bordered select-accent select-sm"
                    >
                      <option value="" selected disabled>
                        Tanlang
                      </option>
                      {banners?.map?.((banner, ind) => {
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
                    >
                      <option value="" selected disabled>
                        Tanlang
                      </option>
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
                  >
                    <option value="" selected disabled>
                      Tanlang
                    </option>
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
    </div>
  );
};

export default index;

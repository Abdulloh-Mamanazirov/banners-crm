import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const index = () => {
  const token = sessionStorage.getItem("banner-token");
  const orderEditModal = useRef();
  const navigate = useNavigate();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [orderInfo, setOrderInfo] = useState();
  const [nextPage, setNextPage] = useState(null);
  const [data, setData] = useState({
    orders: [],
    banners: [],
    users: [],
  });

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
      return setData((prev) => ({
        ...prev,
        banners: response?.data?.data,
      }));
    }
  }

  async function getUsers() {
    let response = await axios.patch(`/${token}/users/get`).catch((err) => {
      if (err) return;
    });

    if (response?.status === 200) {
      setData((prev) => ({
        ...prev,
        users: response?.data?.data?.data,
      }));

      if (response?.data?.data?.next_page_url?.length > 0) {
        let users1 = await getMoreUsers(response?.data?.data?.next_page_url);
        setData((prev) => ({
          ...prev,
          users: [...prev.users, ...users1?.data],
        }));

        if (users1?.next_page_url?.length > 0) {
          let users2 = await getMoreUsers(users1?.next_page_url);
          setData((prev) => ({
            ...prev,
            users: [...prev.users, ...users2?.data],
          }));

          if (users2?.next_page_url?.length > 0) {
            let users3 = await getMoreUsers(users2?.next_page_url);
            setData((prev) => ({
              ...prev,
              users: [...prev.users, ...users3?.data],
            }));

            if (users3?.next_page_url?.length > 0) {
              let users4 = await getMoreUsers(users3?.next_page_url);
              setData((prev) => ({
                ...prev,
                users: [...prev.users, ...users4?.data],
              }));
            }
          }
        }
      }
    }
  }

  async function getMoreUsers(url) {
    let response = await axios.patch(url).catch((err) => {
      return false;
    });
    return response?.data?.data;
  }

  async function getOrders() {
    let response = await axios
      .get(`/order/${token}/get`)
      .catch((err) => {
        if (err?.response?.status === 500) {
          return toast("Serverga bog'lanib bo'lmadi!", { type: "error" });
        } else if (err?.response?.status === 401) {
          toast("Siz buyurtmalar ro'yxatini ko'ra olmaysiz!", {
            type: "warning",
          });
        }
      })
      .finally(() => setListLoading(false));

    if (response?.data?.code === 200) {
      setNextPage(response?.data?.data?.next_page_url);
      return setData((prev) => ({
        ...prev,
        orders: response?.data?.data?.data,
      }));
    }
  }

  async function loadNextPage() {
    let response = await axios
      .patch(nextPage)
      .catch(async (err) => {
        if (err?.response?.data?.code === 403) {
          sessionStorage.removeItem("banner-token");
          return window.location.replace("/login");
        } else {
          await getBanners();
          toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      })
      .finally(() => setListLoading(false));

    if (response?.data?.code === 200) {
      setNextPage(response?.data?.data?.next_page_url);
      setData((old) => ({
        ...old,
        orders: [...old.orders, ...response?.data?.data?.data],
      }));
    }
  }

  useEffect(() => {
    getUsers();
    getBanners();
    getOrders();
  }, []);

  async function handleAddOrder(e) {
    e.preventDefault();
    setButtonLoading(true);

    let { user_id, company, banner_id, start_time, end_time, side, price } =
      e.target;
    let data = {
      user_id: user_id.value,
      company_name: company.value,
      banner_id: banner_id.value,
      start_time: new Date(start_time.value).toLocaleDateString("ru-Ru"),
      end_time: new Date(end_time.value).toLocaleDateString("ru-Ru"),
      side_a: side.value,
      side_b: side.value,
      price: price.value,
    };
    if (side.value === "a tanlandi") data.side_b = "";
    if (side.value === "b tanlandi") data.side_a = "";

    let response = await axios
      .post(`/order/${token}/store`, data)
      .catch((err) => {
        if (err?.response?.data?.code === 403) {
          return toast("Siz bu amalni bajara olmaysiz!", { type: "warning" });
        } else if (err?.response?.data?.code === 500) {
          return toast("Serverga bog'lanib bo'lmadi!", { type: "error" });
        } else {
          return toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      })
      .finally(() => setButtonLoading(false));

    if (response?.data?.code === 200) {
      getOrders();
      toast("Buyurtma qo'shildi", { type: "success" });
    }
  }

  async function handleUpdateOrder(e) {
    e.preventDefault();

    let { banner_id, start_time, end_time, side } = e.target;
    let data = {
      banner_id: banner_id.value,
      start_time: start_time.value,
      end_time: end_time.value,
      side_a: side.value,
      side_b: side.value,
    };
    if (side.value === "a tanlandi") data.side_b = "";
    if (side.value === "b tanlandi") data.side_a = "";

    let response = await axios
      .post(`/order/${token}/update/${orderInfo?.id}`, data)
      .catch((err) => {
        if (err?.response?.data?.code === 403) {
          return toast("Siz bu amalni bajara olmaysiz!", { type: "error" });
        } else if (err?.response?.data?.code === 500) {
          return toast("Serverga bog'lanib bo'lmadi!", { type: "error" });
        } else {
          return toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      });

    if (response?.data?.code === 200) {
      getOrders();
      orderEditModal.current.close();
      return toast("Buyurtma tahrirlandi!", { type: "info" });
    }
  }

  async function handleDeleteOrder(id) {
    let response = await axios
      .delete(`/order/${sessionStorage.getItem("banner-token")}/delete/${id}`)
      .catch((err) => {
        if (err) toast("Nimadadir xatolik ketdi!", { type: "error" });
      });
    if (response.status === 200) {
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
            <label htmlFor="user" className="label">
              Buyurtma qilivchi:
            </label>
            <select
              required
              name="user_id"
              id="user"
              className="w-full select select-bordered select-primary"
              onChange={(e) => e.target.value === "new" && navigate("/users")}
            >
              <option value={""} selected disabled></option>
              {data?.users?.map?.((user, ind) => {
                return (
                  <option key={ind} value={user?.id}>
                    {user?.name}
                  </option>
                );
              })}
              <option value={"new"} className="text-black/50">
                + Yangi foydalanuvchi qo'shish
              </option>
            </select>
          </div>
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
              <option value="tanlandi">Ikkala tarafi</option>
              <option value="a tanlandi">A tarafi</option>
              <option value="b tanlandi">B tarafi</option>
            </select>
          </div>
          <div>
            <label htmlFor="start" className="label">
              Boshlanish sanasi:
            </label>
            <input
              required
              type="datetime-local"
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
              type="datetime-local"
              name="end_time"
              id="end"
              className="w-full input input-bordered input-primary"
            />
          </div>
          <div>
            <label htmlFor="price" className="label">
              Oldindan to'lov:
            </label>
            <input
              required
              type="number"
              name="price"
              id="price"
              title="Oldindan to'lov"
              minLength={100}
              min={0}
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
                      <h2 className="text-5xl uppercase font-bold">Bo'sh</h2>
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
                          if (b.id == order.banner_id) return <>{b?.name}</>;
                        })}
                      </p>
                      <p>
                        (
                        {order?.side_a === "tanlandi" &&
                        order?.side_b === "tanlandi"
                          ? "Ikkala taraf"
                          : order?.side_a === "a tanlandi"
                          ? "A taraf"
                          : order?.side_b === "b tanlandi"
                          ? "B taraf"
                          : ""}
                        )
                      </p>
                    </td>
                    <td>
                      {data?.users?.map?.((u) => {
                        if (u.id == order.user_id) return <>{u?.name}</>;
                      })}
                    </td>
                    <td>{order?.created_at.slice(0, 10)}</td>
                    <td>{order?.start_time.slice(0, 16).replace("T", " ")}</td>
                    <td>{order?.end_time.slice(0, 16).replace("T", " ")}</td>
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
            <button
              onClick={loadNextPage}
              className={`mt-5 w-full btn btn-outline capitalize text-lg ${
                nextPage === null && "hidden"
              }`}
            >
              Ko'proq ko'rish <span className="fa-solid fa-arrow-down" />
            </button>
          </>
        )}
      </div>

      {/* Admin edit modal */}
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
                  <th>Banner:</th>
                  <td>
                    <select
                      name="banner_id"
                      id="banner_id"
                      className="w-full select select-bordered select-accent select-sm"
                      defaultValue={orderInfo?.id}
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
                    >
                      <option value="tanlandi">Ikkala tarafi</option>
                      <option value="a tanlandi">A tarafi</option>
                      <option value="b tanlandi">B tarafi</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Boshlanish sanasi:</th>
                  <td>
                    <input
                      required
                      type="datetime-local"
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
                      type="datetime-local"
                      name="end_time"
                      id="end"
                      className="w-full input input-bordered input-accent input-sm"
                      defaultValue={orderInfo?.end_time}
                    />
                  </td>
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

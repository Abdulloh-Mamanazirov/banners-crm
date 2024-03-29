import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateUsers } from "../../redux";

const index = () => {
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [users, setUsers] = useState();
  const dispatch = useDispatch();

  async function handleRegister(e) {
    e.preventDefault();
    setBtnLoading(true);

    let { name, phone } = e.target;
    let data = {
      name: name.value,
      phone: phone.value,
      password: Math.random(),
    };

    let response = await axios
      .post(`${sessionStorage.getItem("banner-token")}/users/create`, data)
      .catch((err) => {
        if (err?.response?.status === 400) {
          return toast("Kiritilgan ma'lumotlar allaqachon foydalanilgan!", {
            type: "error",
          });
        } else if (err?.response?.status === 500) {
          return toast("Serverda xato!", { type: "error" });
        } else {
          return toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      })
      .finally(() => setBtnLoading(false));

    if (response?.data?.code === 403) {
      return toast("Siz bu amalni bajara olmaysiz!", { type: "warning" });
    } else if (response.status === 200) {
      getUsers();
      return toast("Foydalanuvchi muvaffaqiyatli qo'shildi", {
        type: "success",
      });
    }
  }

  async function getUsers() {
    let response = await axios
      .patch(`/${sessionStorage.getItem("banner-token")}/users/get`)
      .catch((err) => {
        if (err?.response?.data?.code === 403) {
          return toast("Siz foydalanuvchilar ro'yxatini ko'ra olmaysiz!", {
            type: "warning",
          });
        } else if (err?.response?.data?.code === 500) {
          return toast("Serverga bog'lanib bo'lmadi!", { type: "error" });
        } else {
          return toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      })
      .finally(() => setLoading(false));

    if (response?.status === 200) {
      setNextPage(response?.data?.data?.next_page_url);
      dispatch(updateUsers(response?.data?.data?.data?.length));
      return setUsers(response?.data?.data?.data);
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
      .finally(() => setLoading(false));

    if (response?.data?.code === 200) {
      setNextPage(response?.data?.data?.next_page_url);
      setUsers((old) => [...old, ...response?.data?.data?.data]);
      dispatch(updateUsers(response?.data?.data?.data?.length));
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  async function handleDeleteUser(user) {
    let response = await axios
      .delete(
        `/${sessionStorage.getItem("banner-token")}/users/delete/${user?.id}`
      )
      .catch((err) => {
        if (err?.response?.status === 500)
          toast("Serverga bog'lanib bo'lmadi!", { type: "error" });
        else if (err?.response?.status === 404)
          toast("Foydalanuvchi topilmadi!", { type: "error" });
        else toast("Nimadadir xatolik ketdi!", { type: "error" });
      });

    if (response?.status === 200) {
      getUsers();
      return toast("Foydalanuvchi o'chirildi", { type: "info" });
    }
  }

  return (
    <>
      {/* Add new uesr */}
      <div className="mb-5">
        <h3 className="text-3xl md:text-4xl font-semibold">
          Yangi foydalanuvchi qo'shish:
        </h3>
        <form
          onSubmit={handleRegister}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 items-end"
        >
          <div>
            <label htmlFor="name" className="label">
              Ism Familiya:
            </label>
            <input
              required
              type="text"
              name="name"
              id="name"
              title="Ismni kiriting"
              placeholder="To'liq ism"
              className="w-full input input-bordered input-primary"
            />
          </div>
          <div>
            <label htmlFor="degree" className="label">
              Tel. raqam:
            </label>
            <input
              required
              type="phone"
              name="phone"
              id="phone"
              title="Tel. raqam kiriting"
              placeholder="+998 90 123 45 67"
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

      {/* Users table */}
      <div className="relative overflow-auto max-h-[88vh] max-w-[88vw]">
        {loading ? (
          <div className="grid place-items-center">
            <div className="text-center">
              <span className="loading loading-bars loading-lg"></span>
              <p>Foydalanuvchilar yuklanmoqda...</p>
            </div>
          </div>
        ) : (
          <>
            <table className="table table-pin-rows">
              <thead>
                <tr className="bg-base-300 text-sm">
                  <th>#</th>
                  <th>To'liq Ismi</th>
                  <th>Tel. raqam</th>
                  <th>Sana</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users?.length === 0 && (
                  <tr className="text-center">
                    <td colSpan={6} className="text-center">
                      <h2 className="text-5xl uppercase font-bold">Bo'sh</h2>
                      <p>Foydalanuvchilar mavjud emas</p>
                    </td>
                  </tr>
                )}
                {users?.map?.((user, ind) => (
                  <tr key={ind} className="hover">
                    <th>{ind + 1}</th>
                    <td>{user?.name}</td>
                    <td>
                      <a href={`tel:${user?.phone}`}>{user?.phone}</a>
                    </td>
                    <td>{user?.created_at.slice(0, 10)}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(user)}
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
    </>
  );
};

export default index;

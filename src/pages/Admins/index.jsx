import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateAdmins } from "../../redux";

const index = () => {
  const adminEditModal = useRef();
  const [admins, setAdmins] = useState([]);
  const [adminInfo, setAdminInfo] = useState();
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const dispatch = useDispatch();

  async function getAdmins() {
    let response = await axios
      .get(`/users/`)
      .catch((err) => {
        if (err) {
          return toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      })
      .finally(() => setTableLoading(false));

    if (response?.status === 200) {
      dispatch(updateAdmins(response?.data?.length));
      return setAdmins(response?.data);
    }
  }

  useEffect(() => {
    getAdmins();
  }, []);

  async function handleAddAdmin(e) {
    e.preventDefault();
    setLoading(true);

    let { name, degree, username, password } = e.target;

    let data = {
      username: username.value,
      full_name: name.value,
      admin_status: degree.value,
      password: password.value,
    };

    let response = await axios
      .post("/users/", data)
      .catch((err) => {
        if (err) {
          return toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      })
      .finally(() => setLoading(false));

    if (response.status === 201) {
      return toast("Admin yaratildi!", { type: "success" });
    }
  }

  async function handleUpdateAdmin(e) {
    e.preventDefault();

    let { name, degree, username, password } = e.target;

    let data = {
      username: username.value,
      full_name: name.value,
      admin_status: degree.value,
      password: password.value,
    };

    let cleanedObj = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => !!value)
    );

    let response = await axios
      .patch(`/users/${adminInfo?.id}/`, cleanedObj)
      .catch((err) => {
        if (err?.response?.status === 500) {
          toast("Serverga bog'lanib bo'lmadi!", { type: "error" });
        } else {
          toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      });

    if (response.status === 200) {
      getAdmins();
      adminEditModal.current.close();
      return toast("Admin tahrirlandi!", { type: "info" });
    }
  }

  async function handleDeleteAdmin(admin) {
    let response = await axios.delete(`/users/${admin?.id}/`).catch((err) => {
      if (err?.response?.status === 500)
        toast("Serverga bog';'lanib bo'lmadi!", { type: "error" });
      else toast("Nimadadir xatolik ketdi!", { type: "error" });
    });

    if (response?.status === 204) {
      getAdmins();
      return toast("Admin o'chirildi", { type: "info" });
    }
  }

  return (
    <>
      {/* Add new admin */}
      <div className="mb-5">
        <h3 className="text-3xl md:text-4xl font-semibold">
          Yangi admin qo'shish:
        </h3>
        <form
          onSubmit={handleAddAdmin}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 items-end"
        >
          <div>
            <label htmlFor="name" className="label">
              Ismni kiriting:
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
              Admin darajasi:
            </label>
            <select
              required
              name="degree"
              id="degree"
              className="w-full select select-bordered select-primary"
            >
              <option value="high_rank">Eng yuqori</option>
              <option value="middle_rank">O'rta</option>
              <option value="low_rank">Past</option>
            </select>
          </div>
          <div>
            <label htmlFor="username" className="label">
              Admin username:
            </label>
            <input
              required
              type="text"
              name="username"
              id="username"
              title="Username"
              placeholder="Username"
              minLength={5}
              className="w-full input input-bordered input-primary"
            />
          </div>
          <div>
            <label htmlFor="password" className="label">
              Admin paroli:
            </label>
            <input
              required
              type="password"
              name="password"
              id="password"
              title="Parol"
              placeholder="********"
              minLength={5}
              className="w-full input input-bordered input-primary"
            />
          </div>
          <div className="w-full flex items-center gap-3">
            <button
              disabled={loading}
              type="submit"
              className="w-9/12 btn btn-primary"
            >
              {loading ? (
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

      {/* Admins table */}
      <div className="relative overflow-auto max-h-[90vh] max-w-[88vw]">
        {tableLoading ? (
          <div className="text-center">
            <span className="loading loading-bars loading-lg" />
            <p>Adminlar yuklanmoqda...</p>
          </div>
        ) : (
          <>
            <table className="table table-pin-rows table-xs md:table-md">
              <thead>
                <tr className="bg-base-200 md:text-sm">
                  <th>#</th>
                  <th>To'liq ismi</th>
                  <th>Username</th>
                  <th>Saylangan sana</th>
                  <th>Darajasi</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {admins?.map?.((admin, ind) => (
                  <tr className="hover" key={ind}>
                    <th>{ind + 1}</th>
                    <td>{admin?.full_name}</td>
                    <td>{admin?.username}</td>
                    <td>{admin?.created_date.slice(0, 10)}</td>
                    <td>
                      {admin?.admin_status === "high_rank"
                        ? "Eng yuqori"
                        : admin?.admin_status === "middle_rank"
                        ? "O'rta"
                        : "Past"}
                    </td>
                    <td>
                      <button
                        className="tooltip tooltip-info btn btn-info btn-xs md:btn-sm mr-3 text-white normal-case my-2 md:my-0"
                        data-tip="Tahrirlash"
                        onClick={() => {
                          setAdminInfo(admin);
                          adminEditModal.current.showModal();
                        }}
                      >
                        <span className="fa-solid fa-edit" />
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(admin)}
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

      {/* Admin edit modal */}
      <dialog
        ref={adminEditModal}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Tahrirlash</h3>
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-5 top-5">
              ✕
            </button>
          </form>
          <form onSubmit={handleUpdateAdmin}>
            <table className="table">
              <tbody>
                <tr>
                  <th>To'liq ismi:</th>
                  <td>
                    <input
                      type="text"
                      defaultValue={adminInfo?.full_name}
                      name="name"
                      className="w-full sm:w-auto input input-bordered input-accent input-sm"
                    />
                  </td>
                </tr>
                <tr>
                  <th>Admin darajasi:</th>
                  <td>
                    <select
                      name="degree"
                      title="Tanlash"
                      defaultValue={adminInfo?.admin_status}
                      className="w-full sm:w-auto select select-bordered select-accent select-sm"
                    >
                      <option value="high_rank">Eng yuqori</option>
                      <option value="middle_rank">O'rta</option>
                      <option value="low_rank">Past</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Username:</th>
                  <td>
                    <input
                      type="text"
                      defaultValue={adminInfo?.username}
                      name="username"
                      className="w-full sm:w-auto input input-bordered input-accent input-sm"
                    />
                  </td>
                </tr>
                <tr>
                  <th>Yangi parol:</th>
                  <td>
                    <input
                      type="password"
                      name="password"
                      minLength={5}
                      className="w-full sm:w-auto input input-bordered input-accent input-sm"
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

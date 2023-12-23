import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateUsers } from "../../redux";

const index = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState();
  const dispatch = useDispatch();

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
      dispatch(updateUsers(response?.data?.data?.data?.length));
      return setUsers(response?.data?.data?.data);
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
      <div className="relative overflow-auto max-h-[88vh]">
        {loading ? (
          <div className="grid place-items-center">
            <div className="text-center">
              <span className="loading loading-bars loading-lg"></span>
              <p>Foydalanuvchilar yuklanmoqda...</p>
            </div>
          </div>
        ) : (
          <table className="table table-pin-rows">
            <thead>
              <tr className="bg-base-300 text-sm">
                <th>#</th>
                <th>To'liq Ismi</th>
                <th>Email</th>
                <th>Username</th>
                <th>Sana</th>
                <th>Tasdiqlangan</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users?.map?.((user, ind) => (
                <tr key={ind} className="hover">
                  <th>{ind + 1}</th>
                  <td>{user?.name}</td>
                  <td>
                    <a href={`mailto:${user?.email}`}>{user?.email}</a>
                  </td>
                  <td>{user?.login}</td>
                  <td>{user?.created_at.slice(0, 10)}</td>
                  <td>
                    {user?.verified === "1" ? (
                      <span className="badge badge-success ">✓</span>
                    ) : (
                      <span className="badge badge-error ">×</span>
                    )}
                  </td>
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
        )}
      </div>
    </>
  );
};

export default index;

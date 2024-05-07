import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const getActionName = (action) => {
  switch (action) {
    case "created":
      return "Yaratildi";
    case "updated":
      return "Tahrirlandi";
    case "deleted":
      return "O'chirildi";
    default:
      return "";
  }
};

const index = () => {
  const [data, setData] = useState({
    admin_user_model: [],
    banner_model: [],
    order_model: [],
    payment_model: [],
    outlay_model: [],
  });
  const [loading, setLoading] = useState(true);
  const [logModel, setLogModel] = useState("");

  async function getLogs() {
    let response = await axios
      .get(`/action-log/`)
      .catch((err) => {
        if (err) {
          return toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      })
      .finally(() => setLoading(false));

    if (response?.status === 200) {
      setData((old) => ({
        ...old,
        admin_user_model: response.data.filter(
          (item) => item.object_model === "user_model"
        ),
        banner_model: response.data.filter(
          (item) => item.object_model === "banner_model"
        ),
        order_model: response.data.filter(
          (item) => item.object_model === "order_model"
        ),
        payment_model: response.data.filter(
          (item) => item.object_model === "payment_model"
        ),
        outlay_model: response.data.filter(
          (item) => item.object_model === "outlay_model"
        ),
      }));
    }
  }

  useEffect(() => {
    getLogs();
  }, []);

  async function handleDeleteLog(id) {
    let response = await axios.delete(`/action-log/${id}/`).catch((err) => {
      if (err) toast("Nimadadir xatolik ketdi!", { type: "error" });
    });
    if (response.status === 204) {
      toast("Amal tarixi o'chirildi", { type: "info" });
      return getLogs();
    }
  }

  if (loading) {
    return (
      <div>
        <div className="text-center">
          <span className="loading loading-bars loading-lg"></span>
          <p>Amallar tarixi yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto max-w-[100vw]">
      <div className="my-5 flex items-center justify-center gap-3 text-2xl">
        <h3>Amallar tarixi</h3>
        <select
          className="select select-sm text-xl"
          onChange={(e) => setLogModel(e.target.value)}
        >
          <option value="">Barcha modellar</option>
          <option value="admin_user_model">Adminlar</option>
          <option value="banner_model">Bannerlar</option>
          <option value="order_model">Buyurtmalar</option>
          <option value="payment_model">To'lovlar</option>
          <option value="outlay_model">Chiqimlar</option>
        </select>
        <h3>uchun</h3>
      </div>

      {/* admin */}
      {(logModel === "admin_user_model" || logModel === "") && (
        <div className="mb-5">
          <h3 className="text-xl md:text-2xl font-semibold mb-5">
            Adminlar ustida bajarilgan amallar tarixi:
          </h3>
          <table className="table table-md w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Bajaruvchi username</th>
                <th>Bajarilgan amal</th>
                <th>Admin</th>
                <th className="w-32">Vaqti</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.admin_user_model?.map?.((item, ind) => {
                return (
                  <tr key={ind}>
                    <td>{ind + 1}</td>
                    <td>{item?.object_instance?.user}</td>
                    <td>{getActionName(item?.action_type)}</td>
                    <td>{item?.object_instance?.object_instance?.username}</td>
                    <td>{item?.timestamp.slice(0, 10)}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteLog(item?.id)}
                        className="tooltip tooltip-error btn btn-error btn-xs md:btn-sm mr-3 text-white normal-case"
                        data-tip="O'chirish"
                      >
                        <span className="fa-solid fa-trash-can" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* outcome */}
      {(logModel === "outlay_model" || logModel === "") && (
        <div className="mb-5">
          <h3 className="text-xl md:text-2xl font-semibold mb-5">
            Chiqim ustida bajarilgan amallar tarixi:
          </h3>
          <table className="table table-md w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Admin username</th>
                <th>Bajarilgan amal</th>
                <th>Summa</th>
                <th className="w-32">Vaqti</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.outlay_model?.map?.((item, ind) => {
                return (
                  <tr key={ind}>
                    <td>{ind + 1}</td>
                    <td>{item?.object_instance?.user}</td>
                    <td>{getActionName(item?.action_type)}</td>
                    <td>
                      {Number(
                        item?.object_instance?.object_instance?.outlay_amount
                      ).toLocaleString("uz-Uz")}
                    </td>
                    <td>{item?.timestamp.slice(0, 10)}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteLog(item?.id)}
                        className="tooltip tooltip-error btn btn-error btn-xs md:btn-sm mr-3 text-white normal-case"
                        data-tip="O'chirish"
                      >
                        <span className="fa-solid fa-trash-can" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* payment */}
      {(logModel === "payment_model" || logModel === "") && (
        <div className="mb-5">
          <h3 className="text-xl md:text-2xl font-semibold mb-5">
            To'lovlar ustida bajarilgan amallar tarixi:
          </h3>
          <table className="table table-md w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Admin username</th>
                <th>Bajarilgan amal</th>
                <th>Buyurtmachi</th>
                <th>To'lov</th>
                <th className="w-32">Vaqti</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.payment_model?.map?.((item, ind) => {
                return (
                  <tr key={ind}>
                    <td>{ind + 1}</td>
                    <td>{item?.object_instance?.user}</td>
                    <td>{getActionName(item?.action_type)}</td>
                    <td>
                      {item?.object_instance?.object_instance?.client__company}
                    </td>
                    <td>
                      {Number(
                        item?.object_instance?.object_instance?.payment_amount
                      ).toLocaleString("uz-Uz")}
                    </td>
                    <td>{item?.timestamp.slice(0, 10)}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteLog(item?.id)}
                        className="tooltip tooltip-error btn btn-error btn-xs md:btn-sm mr-3 text-white normal-case"
                        data-tip="O'chirish"
                      >
                        <span className="fa-solid fa-trash-can" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* order */}
      {(logModel === "order_model" || logModel === "") && (
        <div className="mb-5">
          <h3 className="text-xl md:text-2xl font-semibold mb-5">
            Buyurtmalar ustida bajarilgan amallar tarixi:
          </h3>
          <table className="table table-md w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Admin username</th>
                <th>Bajarilgan amal</th>
                <th>Buyurtmachi</th>
                <th className="w-32">Vaqti</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.order_model?.map?.((item, ind) => {
                return (
                  <tr key={ind}>
                    <td>{ind + 1}</td>
                    <td>{item?.object_instance?.user}</td>
                    <td>{getActionName(item?.action_type)}</td>
                    <td>{item?.object_instance?.object_instance?.company}</td>
                    <td>{item?.timestamp.slice(0, 10)}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteLog(item?.id)}
                        className="tooltip tooltip-error btn btn-error btn-xs md:btn-sm mr-3 text-white normal-case"
                        data-tip="O'chirish"
                      >
                        <span className="fa-solid fa-trash-can" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* banner */}
      {(logModel === "banner_model" || logModel === "") && (
        <div className="mb-5">
          <h3 className="text-xl md:text-2xl font-semibold mb-5">
            Bannerlar ustida bajarilgan amallar tarixi:
          </h3>
          <table className="table table-md w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Admin username</th>
                <th>Bajarilgan amal</th>
                <th>Banner</th>
                <th className="w-32">Vaqti</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.banner_model?.map?.((item, ind) => {
                return (
                  <tr key={ind}>
                    <td>{ind + 1}</td>
                    <td>{item?.object_instance?.user}</td>
                    <td>{getActionName(item?.action_type)}</td>
                    <td>{item?.object_instance?.object_instance?.name}</td>
                    <td>{item?.timestamp.slice(0, 10)}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteLog(item?.id)}
                        className="tooltip tooltip-error btn btn-error btn-xs md:btn-sm mr-3 text-white normal-case"
                        data-tip="O'chirish"
                      >
                        <span className="fa-solid fa-trash-can" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default index;

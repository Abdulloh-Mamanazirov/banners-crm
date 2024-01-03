import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const index = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  async function getLogs() {
    let response = await axios
      .post(`/logs/${sessionStorage.getItem("banner-token")}/get`)
      .catch((err) => {
        if (err?.response?.data?.code === 403) {
          return toast("Siz amallar tarixini ko'ra olmaysiz!", {
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
      setData(response?.data?.data);
    }
  }

  useEffect(() => {
    getLogs();
  }, []);

  return (
    <div className="overflow-x-auto max-w-[100vw]">
      <h3 className="text-2xl md:text-3xl font-semibold mb-5">
        Amallar tarixi
      </h3>
      {!loading ? (
        <table className="table table-md w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Admin ismi</th>
              <th>Bajarilgan amal</th>
              <th>Vaqti</th>
            </tr>
          </thead>
          <tbody>
            {data?.map?.((item, ind) => {
              return (
                <tr key={ind}>
                  <td>{ind + 1}</td>
                  <td>{item?.admin_name}</td>
                  <td>{item?.action}</td>
                  <td>{item?.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <span className="loading loading-bars loading-lg"></span>
            <p>Loglar yuklanmoqda...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default index;

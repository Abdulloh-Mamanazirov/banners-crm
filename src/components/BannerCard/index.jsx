import axios from "axios";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ImageInput, Location } from "../";
import { updateBillboards, updateImage, updateSendingImage } from "../../redux";

const index = ({ data, id, img, state, title, date }) => {
  const dispatch = useDispatch();
  const { billboards } = useSelector((state) => state.stats);
  const { sendingImage } = useSelector((state) => state.images);
  const bannerInfoModal = useRef();
  const bannerUpdateModal = useRef();
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState({
    lat: 0,
    lng: 0,
  });

  async function handleEditBanner(e) {
    e.preventDefault();
    setLoading(true);

    let { lat, lng, name, price_a, price_b, type, banner_id } = e.target;

    let data = new FormData();
    data.append("admin_token", sessionStorage.getItem("banner-token"));
    data.append("name", name.value);
    data.append("location", JSON.stringify([lat.value, lng.value]));
    data.append("image", sendingImage);
    data.append("price_a", price_a.value);
    data.append("price_b", price_b.value);
    data.append("type", type.value);
    data.append("banner_id", banner_id.value);

    let response = await axios
      .post(
        `/banner/update/${sessionStorage.getItem("banner-token")}/${id}`,
        data
      )
      .catch((err) => {
        if (err?.response?.status === 403) {
          toast("Siz bu amalni bajara olmaysiz!", { type: "warning" });
        } else {
          toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      })
      .finally(() => {
        bannerUpdateModal.current.close();
        dispatch(updateImage(""));
        dispatch(updateSendingImage(""));
        setLoading(false);
      });
    if (response?.status === 200) {
      bannerUpdateModal.current.close();
      toast("Banner yangilandi", { type: "success" });
      return dispatch(updateBillboards(billboards+1));
    }
  }

  async function handleDeleteBanner(id) {
    let response = await axios
      .delete(`/banner/delete/${sessionStorage.getItem("banner-token")}/${id}`)
      .catch((err) => {
        if (err) toast("Nimadadir xatolik ketdi!", { type: "error" });
      });
    if (response.status === 200) {
      toast("Banner o'chirildi", { type: "info" });
      return dispatch(updateBillboards(billboards - 1));
    }
  }

  return (
    <>
      <div className="p-1 bg-base-100 border border-gray-300 rounded-xl shadow-lg flex flex-col gap-3 transition-all hover:scale-[1.02]">
        <div className="p-1 flex items-start justify-between gap-1">
          <div>
            <h3 className="text-xl font-medium line-clamp-2">{title}</h3>
            <div className="flex items-center gap-3">
              <p className="desc">Xolati:</p>
              <p
                className={`badge ${
                  state === null ? "badge-success" : "badge-error"
                } text-white`}
              >
                {state === null ? "Mavjud" : "Band"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="desc">O'rnatilgan sana:</p>
              <p>{date}</p>
            </div>
          </div>
          <div className="min-w-fit whitespace-nowrap">
            <div className="dropdown dropdown-end ml-auto">
              <label
                role="button"
                tabIndex={0}
                className="text-lg text-blue-500 hover:bg-base-200 py-1 px-4 rounded-full"
              >
                <span className="fa-solid fa-ellipsis-vertical " />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-[10] menu p-2 shadow-lg bg-base-100 rounded-box w-40 border border-gray-400"
              >
                <li>
                  <span onClick={() => bannerInfoModal.current.showModal()}>
                    <span className="fa-solid fa-bars" />
                    <p className="whitespace-nowrap">To'liq ko'rish</p>
                  </span>
                </li>
                <li>
                  <span onClick={() => bannerUpdateModal.current.showModal()}>
                    <span className="fa-solid fa-edit" />
                    <p className="whitespace-nowrap">Tahrirlash</p>
                  </span>
                </li>
                <li className="bg-error rounded-lg text-white">
                  <span onClick={() => handleDeleteBanner(id)}>
                    <span className="fa-solid fa-trash" />
                    <p className="whitespace-nowrap">O'chirish</p>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-full border rounded-lg">
          <img
            src={img}
            alt="billboard image"
            className="w-full aspect-square object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Banner Info Modal */}
      <dialog
        ref={bannerInfoModal}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-3">Banner Info</h3>
          <div className="max-w-full border rounded-lg">
            <img
              src={`https://api.abdullajonov.uz/banner-ads-backend/public/storage/banner/images/${data?.image}`}
              alt="banner image"
              className="w-full aspect-video object-cover rounded-lg"
            />
          </div>
          <div>
            <table className="table">
              <tbody>
                <tr>
                  <th>Banner Id:</th>
                  <td>{data?.banner_id}</td>
                </tr>
                <tr>
                  <th>Nomi:</th>
                  <td>{data?.name}</td>
                </tr>
                <tr>
                  <th>Xolati:</th>
                  <td>
                    <p
                      className={`badge ${
                        state === null ? "badge-success" : "badge-error"
                      } text-white`}
                    >
                      {state === null ? "Mavjud" : "Band"}
                    </p>
                  </td>
                </tr>
                <tr>
                  <th>A tomon narxi:</th>
                  <td>{data?.price_a} so'm</td>
                </tr>
                <tr>
                  <th>B tomon narxi:</th>
                  <td>{data?.price_b} so'm</td>
                </tr>
                <tr>
                  <th>Banner turi:</th>
                  <td>{data?.type}</td>
                </tr>
                <tr>
                  <th>O'rnatilgan sana:</th>
                  <td>{(data?.created_at).slice(0, 10)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm border border-gray-400">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Banner Update Modal */}
      <dialog
        ref={bannerUpdateModal}
        className="modal modal-bottom sm:modal-top"
      >
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-3">Tahrirlash</h3>
          <form onSubmit={handleEditBanner}>
            <div className="max-w-full grid grid-cols-1 gap-3 mb-5 md:mb-0 md:grid-cols-2">
              <div>
                <div className="h-96 mb-3">
                  <Location
                    location={JSON.parse(data?.location)}
                    handlePickLocation={(e) =>
                      setCoordinates((prev) => ({
                        ...prev,
                        lat: e?.latlng?.lat,
                        lng: e?.latlng?.lng,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-evenly flex-wrap">
                  <div className="flex items-center gap-1">
                    <label htmlFor="lat" className="label">
                      Latitude:
                    </label>
                    <input
                      disabled
                      value={
                        coordinates.lat === 0
                          ? JSON.parse(data?.location)?.[0]
                          : coordinates.lat
                      }
                      type="text"
                      id="lat"
                      name="lat"
                      className="input input-sm input-bordered outline outline-1"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <label htmlFor="lng" className="label">
                      Longitude:
                    </label>
                    <input
                      disabled
                      value={
                        coordinates.lng === 0
                          ? JSON.parse(data?.location)?.[1]
                          : coordinates.lng
                      }
                      type="text"
                      id="lng"
                      name="lng"
                      className="input input-sm input-bordered outline outline-1"
                    />
                  </div>
                </div>
              </div>
              <div className="h-full">
                <div className="w-full h-full">
                  <ImageInput
                    onChange={(e) => {
                      dispatch(updateSendingImage(e.target.files[0]));
                      dispatch(
                        updateImage(URL.createObjectURL(e.target.files[0]))
                      );
                    }}
                    id={"image"}
                    height={"h-[340px]"}
                    buttonName={"Yangi rasm tanlang"}
                    required={false}
                  />
                </div>
              </div>
            </div>
            <table className="table">
              <tbody>
                <tr>
                  <th>Nomi:</th>
                  <td>
                    <input
                      type="text"
                      defaultValue={data?.name}
                      name="name"
                      className="w-full sm:w-auto input input-bordered input-accent input-sm"
                    />
                  </td>
                </tr>
                <tr>
                  <th>A tomon narxi:</th>
                  <td>
                    <input
                      type="number"
                      defaultValue={data?.price_a}
                      name="price_a"
                      className="w-full sm:w-auto input input-bordered input-accent input-sm"
                    />{" "}
                    so'm
                  </td>
                </tr>
                <tr>
                  <th>B tomon narxi:</th>
                  <td>
                    <input
                      type="text"
                      defaultValue={data?.price_b}
                      name="price_b"
                      className="w-full sm:w-auto input input-bordered input-accent input-sm"
                    />{" "}
                    so'm
                  </td>
                </tr>
                <tr>
                  <th>Banner turi:</th>
                  <td>
                    <select
                      name="type"
                      title="Tanlash"
                      defaultValue={data?.type}
                      className="w-full sm:w-auto select select-bordered select-accent select-sm"
                    >
                      <option value="devor">Devorda</option>
                      <option value="ustun">Ustunda</option>
                      <option value="boshqa">Boshqa</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Banner Id:</th>
                  <td>
                    <input
                      type="text"
                      defaultValue={data?.banner_id}
                      name="banner_id"
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
                      {loading ? (
                        <span className="fa-solid fa-spinner fa-spin-pulse" />
                      ) : (
                        "Yuborish"
                      )}
                    </button>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </form>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm border border-gray-400">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default index;

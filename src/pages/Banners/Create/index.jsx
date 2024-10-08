import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Placeholder } from "../../../assets";
import { ImageInput, Location } from "../../../components";
import { updateImage } from "../../../redux";

const index = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [images, setImages] = useState({
    cover: Placeholder,
    formImage: {},
  });
  const [coordinates, setCoordinates] = useState({
    lat: 0,
    lng: 0,
  });
  const [loading, setLoading] = useState(false);

  async function handleAddBanner(e) {
    e.preventDefault();
    setLoading(true);

    let { lat, lng, name, type, banner_id, yuriy_face } = e.target;

    let data = new FormData();
    data.append("name", name.value);
    data.append("latitude", lat.value);
    data.append("longitude", lng.value);
    data.append("banner_image", images.formImage);
    data.append("banner_type", type.value);
    data.append("banner_id", banner_id.value);
    data.append("yuriy_face", yuriy_face.value);

    let response = await axios
      .post("/banners/", data)
      .catch((err) => {
        if (err) {
          toast("Nimadadir xatolik ketdi!", { type: "error" });
        }
      })
      .finally(() => {
        dispatch(updateImage(""));
        setLoading(false);
      });
    if (response?.status === 201) {
      navigate("/banners");
      toast("Banner qo'shildi", { type: "success" });
    }
  }

  return (
    <>
      <div className="mb-5">
        <h2 className="text-3xl md:text-4xl font-semibold mb-3">
          Yangi Banner Qo'shish:
        </h2>
        <form onSubmit={handleAddBanner}>
          <div className="flex flex-col my-5">
            <div className="h-96 mb-3">
              <Location
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
                  required
                  disabled
                  value={coordinates.lat}
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
                  required
                  disabled
                  value={coordinates.lng}
                  type="text"
                  id="lng"
                  name="lng"
                  className="input input-sm input-bordered outline outline-1"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 grid-rows-3 gap-3 items-start">
            <div className="flex items-center gap-3 col-span-1 sm:col-span-2 row-span-3">
              <div className="w-full h-full">
                <ImageInput
                  onChange={(e) => {
                    setImages((prev) => ({
                      ...prev,
                      formImage: e.target.files[0],
                      cover: URL.createObjectURL(e.target.files[0] ?? {}),
                    }));
                    dispatch(
                      updateImage(URL.createObjectURL(e.target.files[0]))
                    );
                  }}
                  id={"image"}
                  height={"h-52"}
                  required={true}
                />
              </div>
            </div>
            <div>
              <label htmlFor="name" className="label">
                Banner Nomi:
              </label>
              <input
                required
                type="text"
                name="name"
                id="name"
                title="Enter name"
                placeholder="Name"
                className="w-full input input-bordered input-primary"
              />
            </div>
            <div>
              <label htmlFor="type" className="label">
                Banner turi:
              </label>
              <select
                required
                name="type"
                id="type"
                title="Tanlash"
                className="w-full select select-bordered select-primary"
              >
                <option value="on_a_wall">Devorda</option>
                <option value="on_a_pole">Ustunda</option>
                <option value="else_where">Boshqa</option>
              </select>
            </div>
            <div>
              <label htmlFor="banner_id" className="label">
                Banner Id:
              </label>
              <input
                required
                type="text"
                name="id"
                id="banner_id"
                title="Banner Id kiriting"
                placeholder="Banner id"
                className="w-full input input-bordered input-primary"
              />
            </div>
            <div>
              <label htmlFor="yuriy_face" className="label">
                <p>
                  Yuzi (m<sup>2</sup>):
                </p>
              </label>
              <input
                required
                type="text"
                name="yuriy_face"
                id="yuriy_face"
                title="Banner yuzini kiriting"
                className="w-full input input-bordered input-primary"
              />
            </div>
            <div className="w-full">
              <label htmlFor="null" className="label">
                Yuborish:
              </label>
              <div className="flex items-center gap-3">
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
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default index;

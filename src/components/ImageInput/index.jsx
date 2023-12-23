import { useSelector } from "react-redux";

const index = ({ onChange, id, height, buttonName, required }) => {
  const {editedImage} = useSelector((state)=>state.images)
  
  return (
    <div className="border border-gray-400 rounded-lg max-w-full">
      <div className={`${height} max-w-full rounded-lg hidden md:block`}>
        <img
          src={editedImage}
          alt="Banner image"
          className="max-w-full max-h-full mx-auto rounded-lg aspect-video object-cover"
        />
      </div>
      <div className="relative w-full">
        <label htmlFor={id} role="button" className="w-full btn normal-case">
          <span className="fa-solid fa-camera fa-2x" />
          <p className="hidden md:block">{buttonName ? buttonName : "Rasm tanlang"}</p>
        </label>
        <input
          required={required}
          onChange={onChange}
          type="file"
          id={id}
          title="Choole image"
          className="absolute w-1 right-1/2 opacity-0"
        />
      </div>
    </div>
  );
};

export default index;

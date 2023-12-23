import { NotFound } from "../../assets";

const index = () => {
  return (
    <div className="absolute inset-0 mt-10 grid place-items-center text-center">
      <div>
        <img src={NotFound} alt="Page Not Found" className="max-w-sm" />
        <div>
          <p>Page you are looking for does not exist</p>
          <button
            onClick={() => window.navigation.back()}
            className="btn btn-info mt-3"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default index;

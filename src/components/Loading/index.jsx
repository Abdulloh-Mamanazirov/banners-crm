import React, { useEffect, useState } from "react";

const index = ({state}) => {
  const [loadingState, setLoadingState] = useState("grid");

  useEffect(() => {
    setInterval(() => {
      setLoadingState("hidden");
    }, 2000);
  }, []);

  return (
    <div
      className={`absolute inset-0 ${state ?? loadingState} place-items-center bg-base-100 z-20`}
    >
      <span className="loading loading-bars loading-lg text-blue-600"></span>
    </div>
  );
};

export default index;

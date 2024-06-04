import { Link } from "react-router-dom";

const index = ({img, title, value, desc, link}) => {
  return (
    <Link to={link} className="stats shadow-lg border border-base-300 overflow-hidden transition-all hover:scale-[1.03]">
      <div className="stat">
        {img && <div className="stat-figure">
          <img src={img} alt="icon" className="max-w-[90px]"/>
        </div>}
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-desc">{desc}</div>
      </div>
    </Link>
  );
}

export default index

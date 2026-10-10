import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

export default function NotFound() {
  return (
    <PageHeader
      label="Page not found"
      lines={["This page has", <span className="text-mute">moved on.</span>]}
      text="The link may be old or mistyped."
    >
      <div className="flex gap-6 text-sm md:justify-end">
        <Link to="/" className="nav-link">Back to home</Link>
        <Link to="/services" className="nav-link">Browse services</Link>
      </div>
    </PageHeader>
  );
}

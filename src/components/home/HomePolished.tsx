import { ClassicHome } from "@/pages/Index";

/**
 * Option B — "Polished": the original homepage structure and content,
 * refined purely through scoped CSS (see `.home-polished` in index.css):
 * ambient hero drift, taller banners, editorial rhythm, softer dissolves.
 */
const HomePolished = () => (
  <div className="home-polished">
    <ClassicHome />
  </div>
);

export default HomePolished;

import { Routes, Route } from "react-router-dom";
import ShortenURLs from "./pages/ShortenURLs";
import RedirectHandler from "./pages/RedirectHandler";
import URLStats from "./pages/URLStats";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ShortenURLs />} />
      <Route path="/stats" element={<URLStats />} />
      <Route path="/:shortCode" element={<RedirectHandler />} />
    </Routes>
  );
}

export default App;

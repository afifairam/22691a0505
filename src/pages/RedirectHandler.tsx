// src/pages/RedirectHandler.tsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { log } from "../logging-middleware/log";

const token = "your-access-token"; // Replace this with your real token

const RedirectHandler = () => {
  const { shortCode } = useParams();

  useEffect(() => {
    const data = localStorage.getItem("shortUrls");
    if (!data) {
      alert("No URLs found in storage.");
      return;
    }

    const urls = JSON.parse(data);
    const matched = urls.find((u: any) => {
      const code = u.shortUrl.split("/").pop();
      return code === shortCode;
    });

    if (!matched) {
      alert("Short URL not found.");
      log("frontend", "error", "page", `Shortcode ${shortCode} not found`, token);
      return;
    }

    // Log click
    const clickData = {
      timestamp: new Date().toISOString(),
      source: document.referrer || "direct",
      location: "India", // Static location (since we can't geolocate)
    };

    // Store click stats
    const updatedClicks = matched.clicks || [];
    updatedClicks.push(clickData);
    matched.clicks = updatedClicks;

    // Save back to localStorage
    const updatedList = urls.map((u: any) =>
      u.shortUrl === matched.shortUrl ? matched : u
    );
    localStorage.setItem("shortUrls", JSON.stringify(updatedList));

    log("frontend", "info", "page", `Redirecting to ${matched.longUrl}`, token);

    // Redirect to original URL
    window.location.href = matched.longUrl;
  }, [shortCode]);

  return <p>Redirecting to original URL...</p>;
};

export default RedirectHandler;

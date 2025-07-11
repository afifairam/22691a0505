// src/pages/ShortenURLs.tsx
import { useState } from "react";
import { TextField, Button, Box, Typography, Grid, Paper } from "@mui/material";
import { log } from "../logging-middleware/log";

const token = "your-access-token"; // Replace with your real token

interface UrlEntry {
  longUrl: string;
  validity: number;
  shortcode: string;
  shortUrl?: string;
  expiryTime?: string;
}

const ShortenURLs = () => {
  const [urls, setUrls] = useState<UrlEntry[]>([
    { longUrl: "", validity: 30, shortcode: "" },
  ]);

  const [results, setResults] = useState<UrlEntry[]>([]);

  const handleAddRow = () => {
    if (urls.length >= 5) {
      alert("You can only shorten up to 5 URLs at a time.");
      return;
    }
    setUrls([...urls, { longUrl: "", validity: 30, shortcode: "" }]);
  };

  const handleChange = (index: number, key: keyof UrlEntry, value: string) => {
    const updated = [...urls];
    if (key === "validity") {
      updated[index][key] = parseInt(value || "0");
    } else {
      updated[index][key] = value;
    }
    setUrls(updated);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleShorten = () => {
    const processed: UrlEntry[] = [];

    for (const entry of urls) {
      if (!isValidUrl(entry.longUrl)) {
        alert(`Invalid URL: ${entry.longUrl}`);
        log("frontend", "error", "component", `Invalid URL submitted: ${entry.longUrl}`, token);
        return;
      }

      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + (entry.validity || 30));

      const short = entry.shortcode
        ? entry.shortcode
        : Math.random().toString(36).substring(2, 7); // simple shortcode generator

      processed.push({
        ...entry,
        shortUrl: `${window.location.origin}/${short}`,
        expiryTime: expiryDate.toISOString(),
      });
    }

    setResults(processed);
    localStorage.setItem("shortUrls", JSON.stringify(processed));

    log("frontend", "info", "component", `Shortened ${processed.length} URLs`, token);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>

      {urls.map((entry, i) => (
        <Paper key={i} sx={{ padding: 2, marginBottom: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Long URL"
                value={entry.longUrl}
                onChange={(e) => handleChange(i, "longUrl", e.target.value)}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Validity (min)"
                value={entry.validity}
                onChange={(e) => handleChange(i, "validity", e.target.value)}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Custom Shortcode"
                value={entry.shortcode}
                onChange={(e) => handleChange(i, "shortcode", e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Box display="flex" gap={2}>
        <Button variant="contained" color="primary" onClick={handleAddRow}>
          Add URL
        </Button>
        <Button variant="contained" onClick={handleShorten}>
          Shorten URLs
        </Button>
      </Box>

      {results.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5">Shortened Results</Typography>
          {results.map((res, i) => (
            <Paper key={i} sx={{ p: 2, mt: 2 }}>
              <Typography><strong>Original:</strong> {res.longUrl}</Typography>
              <Typography><strong>Short URL:</strong> <a href={res.shortUrl}>{res.shortUrl}</a></Typography>
              <Typography><strong>Expires At:</strong> {new Date(res.expiryTime!).toLocaleString()}</Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ShortenURLs;

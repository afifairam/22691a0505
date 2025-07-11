// src/pages/URLStats.tsx
import { useEffect, useState } from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import { log } from "../logging-middleware/log";

const token = "your-access-token"; // Replace this with your real token

const URLStats = () => {
  const [urls, setUrls] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("shortUrls");
    if (data) {
      const parsed = JSON.parse(data);
      setUrls(parsed);
      log("frontend", "info", "page", "URLStats page loaded", token);
    }
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Shortened URL Statistics
      </Typography>

      {urls.length === 0 && <Typography>No data available.</Typography>}

      {urls.map((entry, i) => (
        <Paper key={i} sx={{ p: 2, mb: 3 }}>
          <Typography><strong>Original URL:</strong> {entry.longUrl}</Typography>
          <Typography><strong>Short URL:</strong> <a href={entry.shortUrl}>{entry.shortUrl}</a></Typography>
          <Typography><strong>Expires At:</strong> {new Date(entry.expiryTime).toLocaleString()}</Typography>
          <Typography><strong>Total Clicks:</strong> {entry.clicks ? entry.clicks.length : 0}</Typography>

          {entry.clicks && entry.clicks.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1">Click Details:</Typography>
              {entry.clicks.map((click: any, index: number) => (
                <Box key={index} ml={2} mt={1}>
                  <Typography>📍 Location: {click.location}</Typography>
                  <Typography>🕓 Time: {new Date(click.timestamp).toLocaleString()}</Typography>
                  <Typography>🔗 Source: {click.source || "Direct"}</Typography>
                  <Divider sx={{ my: 1 }} />
                </Box>
              ))}
            </>
          )}
        </Paper>
      ))}
    </Box>
  );
};

export default URLStats;

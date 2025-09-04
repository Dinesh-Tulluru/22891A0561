import { useState, useEffect } from "react";
import { Container, Typography, Box, Alert } from "@mui/material";
import Navigation from "../components/Navigation";
import URLForm from "../components/URLForm";
import { URLData } from "../utils/urlService";
import { Log } from "../logger";

export default function URLShortener() {
  const [shortenedUrls, setShortenedUrls] = useState<URLData[]>([]);

  // Log when the page loads
  useEffect(() => {
    Log("frontend", "INFO", "URLShortener", "URL Shortener page loaded");
  }, []);

  const handleUrlShortened = (urlData: URLData) => {
    setShortenedUrls((prev) => [...prev, urlData]);
    Log(
      "frontend",
      "INFO",
      "URLShortener",
      `New URL shortened: ${urlData.originalUrl} → ${window.location.origin}/s/${urlData.shortCode}`
    );

    // ✅ Log warning if limit reached
    if (shortenedUrls.length + 1 >= 5) {
      Log(
        "frontend",
        "WARN",
        "URLShortener",
        "User reached maximum limit of 5 shortened URLs"
      );
    }
  };

  return (
    <>
      <Navigation />
      <Container maxWidth="md">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ textAlign: "center", mb: 3 }}
        >
          URL Shortener Service
        </Typography>

        <Typography
          variant="body1"
          sx={{ mb: 3, textAlign: "center", color: "text.secondary" }}
        >
          Shorten up to 5 URLs at once. Add custom shortcodes and set validity
          periods.
        </Typography>

        {shortenedUrls.length >= 5 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            You have reached the maximum limit of 5 URLs. Please refresh the
            page to start over.
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          {Array.from({ length: Math.min(5, shortenedUrls.length + 1) }).map(
            (_, index) => (
              <URLForm key={index} onUrlShortened={handleUrlShortened} />
            )
          )}
        </Box>

        {shortenedUrls.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Recently Shortened URLs ({shortenedUrls.length}/5)
            </Typography>
            {shortenedUrls.map((url) => (
              <Box
                key={url.id}
                sx={{
                  p: 2,
                  mb: 2,
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  backgroundColor: "#fafafa",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ wordBreak: "break-all", mb: 1 }}
                >
                  <strong>Original:</strong> {url.originalUrl}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Short URL:</strong>{" "}
                  <a
                    href={`/s/${url.shortCode}`}
                    target="_blank"
                    rel="noopener"
                  >
                    {window.location.origin}/s/{url.shortCode}
                  </a>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Created: {url.createdAt.toLocaleString()}
                  {url.validUntil &&
                    ` | Expires: ${url.validUntil.toLocaleDateString()}`}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </>
  );
}

import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import URLShortener from "./pages/URLShortener";
import Statistics from "./pages/Statistics";
import Redirect from "./pages/Redirect";
import { Log } from "./logger";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
  typography: { fontFamily: "Arial, sans-serif" },
});

const App = () => {
  useEffect(() => {
    // Log when app starts
    Log("frontend", "INFO", "App", "Application started successfully");
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<URLShortener />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/s/:shortCode" element={<Redirect />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Helmet } from "react-helmet";

createRoot(document.getElementById("root")!).render(
  <>
    <Helmet>
      <title>ResisTrack - Antimicrobial Resistance Surveillance Platform</title>
      <meta name="description" content="Track and visualize antimicrobial resistance patterns with ResisTrack" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" />
    </Helmet>
    <App />
  </>
);

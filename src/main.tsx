/* eslint-disable react-refresh/only-export-components */
import {createRoot} from "react-dom/client";
import {StrictMode} from "react";
import {KcPage} from "./kc.gen";

// The following block can be uncommented to test a specific page with `yarn dev`
// Don't forget to comment back or your bundle size will increase
import {getKcContextMock} from "./login/KcPageStory";
import Loaded from "./component/Loaded.tsx";

if (import.meta.env.DEV) {
  window.kcContext = getKcContextMock({
    pageId: "register.ftl",
    overrides: {
      locale: {
        currentLanguageTag: "ja-JP",
      },
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {!window.kcContext ? (
      <h1>No Keycloak Context</h1>
    ) : (
      <>
        <Loaded/>
        <KcPage kcContext={window.kcContext}/>
      </>
    )}
  </StrictMode>
);

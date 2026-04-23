import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BlockRegistryShowcasePage, {
  BLOCK_REGISTRY_SHOWCASE_PATH,
} from "./pages/BlockRegistryShowcasePage";
import CateringWielkanocnyPage from "./pages/CateringWielkanocnyPage";
import CateringWielkanocnyThankYouPage from "./pages/CateringWielkanocnyThankYouPage";
import TemplatePage from "./pages/TemplatePage";
import TemplatePage2 from "./pages/TemplatePage2";
import TestowaBlueprintPage from "./pages/TestowaBlueprintPage";
import RootLayout from "./layouts/RootLayout";
import {
  CATERING_WIELKANOCNY_PATH,
  CATERING_WIELKANOCNY_TEST_PATH,
  CATERING_WIELKANOCNY_THANK_YOU_PATH,
} from "./lib/cateringThankYou";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path={BLOCK_REGISTRY_SHOWCASE_PATH} element={<BlockRegistryShowcasePage />} />
        <Route path="/template" element={<TemplatePage />} />
        <Route path="/template2" element={<TemplatePage2 />} />
        <Route path="/testowa-blueprint" element={<TestowaBlueprintPage />} />
      </Route>
      <Route path={CATERING_WIELKANOCNY_PATH} element={<CateringWielkanocnyPage />} />
      <Route path={CATERING_WIELKANOCNY_TEST_PATH} element={<CateringWielkanocnyPage />} />
      <Route path={CATERING_WIELKANOCNY_THANK_YOU_PATH} element={<CateringWielkanocnyThankYouPage />} />
    </Routes>
  );
}

import {Route, Routes} from "react-router-dom";
import {Home} from "./pages/Home";
import ErrorPage from "@/pages/Error";
import RedirectPage from "@/pages/Redirect";

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/:shortLinkId" element={<RedirectPage />} />
        </Routes>
    )
}

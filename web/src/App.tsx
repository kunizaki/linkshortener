import {ThemeProvider} from "styled-components";
import {defaultTheme} from "@/styles/defaultTheme";
import {GlobalStyle} from "@/styles/global";
import {BrowserRouter} from "react-router-dom";
import {Router} from "@/Router";

function App() {
  return (
        <ThemeProvider theme={defaultTheme}>
            <BrowserRouter>
                <Router />
            </BrowserRouter>
            <GlobalStyle />
        </ThemeProvider>
  )
}

export default App

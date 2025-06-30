import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 2px;
        box-sizing: border-box;
        font-family: 'Open Sans', sans-serif;
    }
    body {
        background-color: ${(props) => props.theme.backgroundColor};
    }
`
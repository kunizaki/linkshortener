import {styled} from 'styled-components'

interface TextProps {
    fontSize?: number;
}

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 980px;
    margin: 0 auto;
`

export const LogoElement = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    align-content: center;
    padding-top: 20px;
`

export const BoxContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-top: 20px;
    gap: 20px;
`

export const Box = styled.div`
    background-color: ${(props) => props.theme.colors["gray-100"]};
    border-radius: 8px;
    box-shadow: 0 4px 4px #00000025;
    padding: 32px;
    height: fit-content;
`

export const LinksHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-content: center;
`

export const BoxTitle = styled.div`
    font-size: 18px;
    font-weight: 600;
    color: ${(props) => props.theme.colors["gray-600"]};
    text-align: left;
`

export const BoxForm = styled.div`
    margin-top: 20px;
    margin-bottom: 20px;
`

export const SmallText = styled.p<TextProps>`
    font-size: ${(props) => props?.fontSize || 10}px;
    color: ${(props) => props.theme.colors["gray-500"]};
    margin-top: 5px;
    margin-bottom: 5px;
`

export const InputDefault = styled.input`
    width: -webkit-fill-available;
    border-radius: 8px;
    border: 1px solid #E1E1E6;
    font-size: 14px;
    color: ${(props) => props.theme.colors["gray-400"]};
    height: 42px;
    padding: 8px;
`

export const SubmitButton = styled.button`
    width: -webkit-fill-available;
    margin-top: 20px;
    margin-left: 0;
    margin-right: 0;
    height: 42px;
    border-radius: 8px;
    background-color: ${(props) => props.theme.colors["blue-base"]};
    color: ${(props) => props.theme.colors["white"]};
    opacity: 50%;
    font-size: 14px;
    border: none;
    box-shadow: none;
    outline: none;
    cursor: pointer;
`

export const DownloadButton = styled.button`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    border-radius: 4px;
    gap: 10px;
    border: none;
    height: 40px;
    background-color: ${(props) => props.theme.colors["gray-200"]};
    color: ${(props) => props.theme.colors["gray-500"]};
    cursor: pointer;
    padding: 10px
`

export const ListBoxMessage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    overflow-y: auto;
    max-height: 60vh;
`

export const ListAccessRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    width: 100%;
    gap: 10px;
    border-bottom: 1px solid #E1E1E6;
    padding-top: 10px;
    padding-bottom: 10px;
`

export const TextLink = styled.h4`
    font-size: 12px;
    color: ${(props) => props.theme.colors["blue-base"]};
    margin: 0;
`

export const ButtonCommand = styled.button`
    padding: 10px;
    border-radius: 8px;
    background-color: ${(props) => props.theme.colors["gray-200"]};
    color: #1F2025;
    border: none;
    cursor: pointer;
    margin-right: 5px;
    margin-left: 5px;
`

export const AlertMessageElement = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

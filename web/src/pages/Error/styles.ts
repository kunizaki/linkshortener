import { styled } from 'styled-components'

interface TextProps {
    fontSize: number;
    color?: string;
}

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-content: center;
    width: 100%;
    height: 100vh;
    box-shadow: 0 4px 4px #00000025;
`

export const BoxMessage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;   
    align-items: center;
    align-content: center;
    background-color: ${(props) => props.theme.colors["gray-100"]};   
    border-radius: 8px;
    padding: 64px;    
    width: 580px;
    height: 296px;
    text-align: center;   
`

export const BigText = styled.h1`
    font-size: 24px;
    color: ${(props) => props.theme.colors["gray-600"]};
    margin: 0;
`

export const Text = styled.p<TextProps>`
    font-size: ${(props) => props?.fontSize}px;
    color: ${(props) => props?.color || props.theme.colors["blue-base"]};
`
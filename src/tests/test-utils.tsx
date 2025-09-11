import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { ComponentType, PropsWithChildren } from "react"
import { BrowserRouter } from "react-router-dom"

function customRender(ui: React.ReactElement, { ...renderOptions } = {}) {
    const wrapper = ({ children }: PropsWithChildren) => (
        <BrowserRouter>{children}</BrowserRouter>
    )
    return render(ui,{
        wrapper : wrapper as ComponentType,
        ...renderOptions
    })
}


function setup(jsx:React.ReactElement) {
    return {
        user: userEvent.setup(),
        render : {...customRender(jsx)}
    }
}


// export * from "@testing-library/react"
export {setup}
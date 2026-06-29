import { afterEach, beforeAll, afterAll } from "vitest"
import { cleanup } from "@testing-library/react"
import "@testing-library/jest-dom"
import { server } from "./mocked-server"

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

global.ResizeObserver = ResizeObserverMock

beforeAll(() => {
    server.listen()
})

afterEach(() => {
    server.resetHandlers()
    cleanup()
})

afterAll(() => {
    server.close()
})

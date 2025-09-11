import { afterEach, beforeAll, afterAll } from "vitest"
import { cleanup } from "@testing-library/react"
import "@testing-library/jest-dom"
import { mockedServer } from "./mock/mocked-server"


afterEach(() => {
    cleanup()
})

beforeAll(() => {
    mockedServer.listen()
})

afterAll(() => {
    mockedServer.close()
})

afterEach(() => {
    mockedServer.resetHandlers()
})

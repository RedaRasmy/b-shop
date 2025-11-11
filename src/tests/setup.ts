import { afterEach, beforeAll, afterAll } from "vitest"
import { cleanup } from "@testing-library/react"
import "@testing-library/jest-dom"
import { server } from "./mocked-server"

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

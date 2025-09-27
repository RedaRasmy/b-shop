import { afterEach, beforeAll, afterAll } from "vitest"
import { cleanup } from "@testing-library/react"
import "@testing-library/jest-dom"
import { server } from "./mocked-server"

afterEach(() => {
    cleanup()
})

beforeAll(() => {
    server.listen()
})

afterAll(() => {
    server.close()
})

afterEach(() => {
    server.resetHandlers()
})

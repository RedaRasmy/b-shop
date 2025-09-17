import {
    type TypedUseSelectorHook,
    useDispatch,
    useSelector,
    useStore,
} from "react-redux"
import type { AppDispatch, RootState, AppStore } from "./store"

// Typed versions of the hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppStore = () => useStore<AppStore>()

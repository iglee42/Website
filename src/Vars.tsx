import { createGlobalState } from "react-hooks-global-state";

const { setGlobalState, useGlobalState, getGlobalState } = createGlobalState({
    'info': '',
    'isInfoError': false,
    'showInfo': false,
    'user': null
})

export { useGlobalState, setGlobalState, getGlobalState }
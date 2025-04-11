import { createGlobalState } from "react-hooks-global-state";

const { setGlobalState, useGlobalState } = createGlobalState({
    'info': '',
    'isInfoError': false,
    'showInfo': false,
})

export { useGlobalState, setGlobalState}
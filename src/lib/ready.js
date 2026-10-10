import { createContext, useContext } from "react";

// True once the intro loader has cleared, so hero animations start on time.
export const ReadyContext = createContext(true);
export const useReady = () => useContext(ReadyContext);

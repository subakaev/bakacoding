import React, { createContext, FunctionComponent } from "react";
import { useState } from "react";
import { MemoryCard } from "types/MemoryCard";

interface CardsPlayerContextProps {
  setCards: (cards: MemoryCard[]) => void;
}

const contextDefaults = {
  //TODO:
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCards: () => {},
};

const CardsPlayerContext =
  createContext<CardsPlayerContextProps>(contextDefaults);

export const CardsPlayerContextProvider: FunctionComponent = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cards, setCards] = useState<MemoryCard[]>([]);

  return (
    <CardsPlayerContext.Provider value={{ setCards }}>
      {children}
    </CardsPlayerContext.Provider>
  );
};

export default CardsPlayerContext;

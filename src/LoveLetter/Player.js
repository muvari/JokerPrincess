export const Player = (id) => {
  return {
    id: id,
    wins: 0,
    card: undefined,
    newCard: undefined,
    discarded: [],
    eliminated: false,
    protected: false,
    knownCards: [],
    cardIsKnownBy: []
  };
}
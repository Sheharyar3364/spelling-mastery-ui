export const GameLevelReducer = (gameLevelState, action) => {
    switch(action.type) {
        case("increaseLevel"): {
            return {
                ...gameLevelState, 
                currentLevel: gameLevelState.currentLevel + action.currentLevel
            }
        }
        default: {
            return gameLevelState;
          }
    } 
}  
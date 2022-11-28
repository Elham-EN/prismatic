import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk, RootState} from "../../store";
import {AnyColor, fromKeyword, generateRandomColour, toKeyword} from "../../utils/colourMath";
import {
    clearGuesses,
    setStartingColour
} from "../../../features/colour-guesser/colourGuesserSlice";

export type PuzzleMode = 'rgb' | 'hsl' | 'hsv'

export interface HintSpec {
    hueCutoff: number;
    hueStep: number;
    saturationCutoff: number,
    valueCutoff: number,
    valueStep: number,
}

export interface PuzzleState {
    hintSpec: HintSpec;
    mode: PuzzleMode;
    precision: number,
    target: AnyColor;
}

const initialState: PuzzleState = {
    hintSpec: {
        hueCutoff: 90,
        hueStep: 90,
        saturationCutoff: 25,
        valueCutoff: 25,
        valueStep: 25,
    },
    mode: 'hsv',
    precision: 3,
    target: {r: 40, g: 200, b: 100},
}

export const puzzleSlice = createSlice({
    name: 'puzzle',
    initialState,
    reducers: {
        setMode: (state, action: PayloadAction<PuzzleMode>) => {
            state.mode = action.payload
        },
        setTarget: (state, action: PayloadAction<AnyColor>) => {
            state.target = action.payload
        }
    }
})

export const { setMode, setTarget } = puzzleSlice.actions
export const selectPuzzleState = (state: RootState) => state.puzzle
export default puzzleSlice.reducer

export const startNewGame =
    (): AppThunk =>
        (dispatch, getState) => {
            const newTarget = fromKeyword(toKeyword(generateRandomColour()))
            dispatch(clearGuesses())
            dispatch(setStartingColour(getState().colourGuesser.colour))
            dispatch(setTarget(newTarget));
        };
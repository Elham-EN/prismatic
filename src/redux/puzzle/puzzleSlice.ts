import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '../store'
import { AnyColor, isNamed, NamedColor, toHSB, toNamed } from '../../lib/colour/colourConversions'
import { Hint } from '../../lib/puzzle/hint/hint'
import { getPuzzleId, Puzzle, PuzzleId, PuzzleMode } from '../../lib/puzzle/puzzle'
import { getPuzzleAnswerFromServer, submitGuessToServer } from './puzzleClient'
import { ClientPuzzleSpec, getNewPuzzle } from '../../lib/puzzle/puzzleServer'

export interface PuzzleState {
  answerName?: NamedColor
  currentColour: AnyColor
  gaveUp: boolean
  hints: Hint[]
  mode: PuzzleMode
  precision: number
  puzzleId: PuzzleId
  startingColour: AnyColor
}

const initialPuzzle: Puzzle = {
  answer: toHSB('mediumseagreen'),
  answerName: toNamed('mediumseagreen'),
  mode: 'hsb',
  precision: 3,
}
const startingColour: AnyColor = 'slateblue'
const initialState: PuzzleState = {
  currentColour: startingColour,
  gaveUp: false,
  hints: [],
  mode: initialPuzzle.mode,
  precision: initialPuzzle.precision,
  puzzleId: getPuzzleId(initialPuzzle),
  startingColour,
}

export const submitGuess = createAsyncThunk('puzzle/submitGuess', async (foo: string, api) => {
  console.log('submitGuess')
  console.log(foo)
  const state: RootState = api.getState() as RootState
  return await submitGuessToServer(state.puzzle.currentColour, state.puzzle.puzzleId)
})

export const giveUp = createAsyncThunk('puzzle/giveUp', async (__, api) => {
  const state: RootState = api.getState() as RootState
  return await getPuzzleAnswerFromServer(state.puzzle.puzzleId)
})

export const puzzleSlice = createSlice({
  name: 'puzzle',
  initialState,
  reducers: {
    resetPuzzleState: (state, action: PayloadAction<ClientPuzzleSpec>) => {
      state.answerName = undefined
      state.gaveUp = false
      state.hints = []
      state.mode = action.payload.mode
      state.precision = action.payload.precision
      state.puzzleId = action.payload.puzzleId
      state.startingColour = state.currentColour
    },
    setCurrentColour: (state, action: PayloadAction<AnyColor>) => {
      state.currentColour = action.payload
    },
    setStartingColour: (state, action: PayloadAction<AnyColor>) => {
      state.startingColour = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitGuess.fulfilled, (state, action: PayloadAction<Hint | NamedColor>) => {
        if (isNamed(action.payload)) {
          state.answerName = action.payload
        } else {
          state.hints.push(action.payload)
        }
      })
      .addCase(giveUp.fulfilled, (state, action: PayloadAction<NamedColor>) => {
        state.answerName = action.payload
        state.gaveUp = true
      })
  },
})

export const { resetPuzzleState, setCurrentColour, setStartingColour } = puzzleSlice.actions
export const selectPuzzleState = (state: RootState): PuzzleState => state.puzzle
export default puzzleSlice.reducer

export const startNewGame = (): AppThunk => (dispatch) => {
  dispatch(resetPuzzleState(getNewPuzzle()))
}

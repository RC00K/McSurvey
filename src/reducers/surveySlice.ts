import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SurveyState {
    data: { questionIndex: number; answer: string, image?: string }[];
    isReviewReady: boolean;
}

const initialState: SurveyState = {
    data: [],
    isReviewReady: false,
};

const surveySlice = createSlice({
    name: 'survey',
    initialState,
    reducers: {
        saveSurveyData(state, action: PayloadAction<{ questionIndex: number; answer: string, image?: string }>) {
            state.data.push(action.payload);
        },
        setReviewReady(state) {
            state.isReviewReady = true;
        },
    },
});

export const { saveSurveyData, setReviewReady } = surveySlice.actions;
export default surveySlice.reducer;
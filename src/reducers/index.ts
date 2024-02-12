import { combineReducers } from '@reduxjs/toolkit';
import surveyReducer from './surveySlice';

const rootReducer = combineReducers({
    survey: surveyReducer,
});

export default rootReducer;
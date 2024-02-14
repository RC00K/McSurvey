import React, { createContext, useContext, useState } from 'react';

const ReviewContext = createContext();

export const useReview = () => {
    return useContext(ReviewContext);
};
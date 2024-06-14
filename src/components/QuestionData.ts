type data = {
    driveThruSelection: string;
    questions: QuestionData[];
};

interface QuestionData {
    questionTitle: string;
    questionDesc: string;
    question: string;
    image: string;
}

interface ReviewData {
    driveThruSelection: string;
    questions: QuestionData[];
}

interface SelectedImages {
    [key: string]: string;
}

export type { data, QuestionData, ReviewData, SelectedImages };

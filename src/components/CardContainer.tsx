import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { getSurveys } from "../services/surveyService";
import "./CardContainer.css";

const CardContainer = ({ onCardClick }: { onCardClick: any }) => {
  const history = useHistory();
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      const surveys = await getSurveys();
      console.log(surveys);
      setSurveys(surveys);
    };

    fetchSurveys();
  }, []);

  return (
    <>
      {surveys.map((survey: any) => {
        const surveyDetails = JSON.parse(survey.SurveyJson);
        const surveyType = surveyDetails.surveyTypes[0];

        return (
          <div className="survey__cards" key={survey.ID}>
            <article className="survey__card" onClick={() => history.push(`/survey/${survey.SurveyName}`, { surveyData: surveyDetails })}>
              <div className="survey__card__content">
                <h2 className="survey__card__title">{survey.SurveyName}</h2>
                <p className="survey__card__category">{surveyType.projectType}</p>
              </div>
              <div className="survey__card__bottom">
                <div className="survey__card__props">
                  <div className="survey__card__prop">
                    <p>{surveyType.projectTitle}</p>
                    <p>{surveyType.questions.length} questions</p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        );
      })}
    </>
  );
};

export default CardContainer;

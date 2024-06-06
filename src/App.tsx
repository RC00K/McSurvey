import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom';
import { setupIonicReact } from '@ionic/react';
import Home from './pages/Home';
import Survey from './pages/Survey';
import NotFound from './pages/NotFound';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { useSurvey } from './assets/context/SurveyContext';
import CameraContainer from './components/CameraContainer';

import { getSurveys, getStoreNumbers } from './services/surveyService';

setupIonicReact();

const App: React.FC = () => {
  const [routes, setRoutes] = useState<{ path: string, component: React.FC<RouteComponentProps> }[]>([]);
  const { setSurveyName } = useSurvey();

  useEffect(() => {
    const buildRoutes = async () => {
      const surveys = await getSurveys();
      const storeNumbs = await getStoreNumbers();
      const urls: { path: string; component: React.FC<RouteComponentProps> }[] = [];

      surveys.forEach((survey: any) => {
        const surveyName = survey.SurveyName;
        setSurveyName(surveyName);

        storeNumbs.forEach((store: any) => {
          const storeNumb = store.StoreNumber.trim();
          urls.push({
            path: `/survey/${surveyName}:storeNumber`,
            component: Survey,
          });
        });

        // Survey without storeNumber
        urls.push({
          path: `/survey/${surveyName}`,
          component: Survey,
        });
      });

      setRoutes(urls);
    };

    buildRoutes();
  }, []);

  // const ValidateSurveyRoute: React.FC<{ path: string; component: React.FC<RouteComponentProps> }> = ({ path, component: Component }) => {
  //   return (
  //     <Route
  //       path={path}
  //       render={props => {
  //         const storeNumber = props.match.params.storeNumber;
  //         if (storeNumber && !/^\d{5}$/.test(storeNumber)) {
  //           return <Redirect to="/404" />;
  //         }
  //         return <Component {...props} />;
  //       }}
  //       exact
  //     />
  //   );
  // };

  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        {routes.map((route, index) => (
          <Route key={index} path={route.path} component={route.component} exact />
        ))}
        <Route path="/camera/:questionIndex" component={CameraContainer} />
        <Route path="/404" component={NotFound} />
      </Switch>
    </Router>
  );
};

export default App;

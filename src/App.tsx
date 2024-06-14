import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, RouteComponentProps, useParams } from 'react-router-dom';
import { isPlatform, setupIonicReact } from '@ionic/react';
import { IonContent, IonPage } from '@ionic/react';
import Home from './pages/Home';
import Survey from './pages/Survey';
import NotFound from './pages/NotFound';
import Completed from './pages/Completed';

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
import './theme/qr-code.css';
import { useSurvey } from './assets/context/SurveyContext';
import CameraContainer from './components/CameraContainer';

import { getSurveys, getStoreNumbers } from './services/surveyService';
import QRCode from 'react-qr-code';

setupIonicReact();

const App: React.FC = () => {
  const [routes, setRoutes] = useState<{ path: string, component: React.FC<RouteComponentProps> }[]>([]);
  const { setSurveyName } = useSurvey();
  const [storeToSurvey, setStoreToSurvey] = useState<{ [key: string]: string }>({});
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(isPlatform('desktop'));
  }, []);

  useEffect(() => {
    const buildRoutes = async () => {
      const surveys = await getSurveys();
      const storeNumbs = await getStoreNumbers();
      const urls: { path: string; component: React.FC<RouteComponentProps> }[] = [];

      surveys.forEach((survey: any) => {
        const surveyName = survey.SurveyName;
        setSurveyName(surveyName);

        // Store to survey
        const newStoreToSurvey = {...storeToSurvey};

        storeNumbs.forEach((store: any) => {
          const storeNumb = store.StoreNumber.trim();
          urls.push({
            path: `/survey/${surveyName}:storeNumber`,
            component: Survey,
          });
          // Saving the mapping of store number to survey name
          newStoreToSurvey[storeNumb] = surveyName;
        });

        // Update the store to survey mapping
        setStoreToSurvey(newStoreToSurvey);

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

  // Get the store number and put it on the end of the qr code url
  const qrCode = (surveyName: string, storeNumber: string) => {
    const path = `https://mcsurvey.gomaps.com/survey/${surveyName}${storeNumber}`;

    return (
      <div style={{ height: "auto", margin: "0 auto", maxWidth: 256, width: "100%" }}>
        <QRCode 
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={path} 
          viewBox={`0 0 256 256`}
        />
      </div>
    );
  }

  const QRCodeDisplay: React.FC<RouteComponentProps> = () => {
    const { storeNumber } = useParams<{ storeNumber: string }>();

    const surveyName = storeToSurvey[storeNumber];

    return (
      <IonPage>
        <IonContent>
          <div className="qrcode">
            <div className="qrcode__container">
              <h1 className="qrcode__header">
                Scan the QR code
              </h1>
              <div className="qrcode__image">
                {qrCode(surveyName, storeNumber)}
                <div className="qrcode__outline"></div>
              </div>
              <div className="qrcode__description">
                {isDesktop && 
                  <h1 className="qrcode__title">
                    Looks like your using a desktop
                  </h1>
                }
                <p className="qrcode__subtitle">
                  A mobile device is required to complete the survey
                </p>
              </div>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  };
  
  return (
    <Router>
      <Switch>
        {/* <Route path="/QR:storeNumber" component={QRCodeDisplay} /> */}
        <Route path="/" exact component={Home} />
        {routes.map((route, index) => (
          <Route key={index} path={route.path} component={isDesktop ? QRCodeDisplay : route.component} exact />
        ))}
        <Route path="/camera/:questionIndex" component={CameraContainer} />
        <Route path="/completed" component={Completed} />
        {/* <Route path="/404" component={NotFound} /> */}
      </Switch>
    </Router>
  );
};

export default App;

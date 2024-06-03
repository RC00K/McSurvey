import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { setupIonicReact } from '@ionic/react';
import Home from './pages/Home';
import Survey from './pages/Survey';

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
import { SurveyProvider } from './assets/context/SurveyContext';
import CameraContainer from './components/CameraContainer';

setupIonicReact();

const NotFound: React.FC = () => (
  <div>
    <h1>
      404 Page Not Found
    </h1>
    <p>
      Sorry, that page does not exist.
    </p>
    <Link to="/">Go back to the main page</Link>
  </div>
);

const App: React.FC = () => (
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <SurveyProvider>
        <Route path="/survey/:SurveyName" component={Survey} />
        <Route path="/camera/:questionIndex" component={CameraContainer} />
      </SurveyProvider>
      <Route component={NotFound} />
    </Switch>
  </Router>
);

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
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
import Review from './pages/Review';
import { ReviewProvider } from './components/Review/ReviewContext';
import Camera from './pages/Camera';
import CameraContainer from './components/CameraContainer';

setupIonicReact();

const App: React.FC = () => (  
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <ReviewProvider>
        <Route path="/survey/:surveyId" component={Survey} />
        <Route path="/camera/:questionIndex" component={CameraContainer} />
        <Route path="/review" component={Review} />
      </ReviewProvider>
    </Switch>
  </Router>
);

export default App;

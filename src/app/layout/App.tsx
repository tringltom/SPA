import { Fragment, useEffect } from "react";
import ModalContainer from "../common/modals/ModalContainer";
import { observer } from "mobx-react-lite";
import { Route, RouteComponentProps, Switch, useLocation, withRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Container } from "semantic-ui-react";
import RegisterSuccess from "../../features/user/RegisterSuccess";
import VerifyEmail from "../../features/user/VerifyEmail";
import NotFound from "./NotFound";
import Navbar from "../../features/navbar/Navbar";
import  './styles.css';
import ArenaDashboard from "../../features/arena/ArenaDashboard";
import PrivateRoute from "./PrivateRoute";
import { useContext } from "react";
import { RootStoreContext } from "../stores/rootStore";
import { LoadingComponent } from "./LoadingComponent";
import WelcomeScreen from "../../features/WelcomeScreen";
import PuzzleForm from "../../features/activities/PuzzleForm";
import Approvals from "../../features/Approvals";
import GoodDeedForm from "../../features/activities/GoodDeedForm";
import ChallengeForm from "../../features/activities/ChallengeForm";
import JokeForm from "../../features/activities/JokeForm";
import QuoteForm from "../../features/activities/QuoteForm";
import HappeningForm from "../../features/activities/HappeningForm";
import ProfilePage from "../../features/profile/ProfilePage";
import { ActivityTypes } from "../models/activity";


const App: React.FC<RouteComponentProps> = () => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
  const { getUser, isLoggedIn } = rootStore.userStore;

  useEffect(() => {
    if (token && !appLoaded && !isLoggedIn) {
      getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [getUser, setAppLoaded, token, appLoaded, isLoggedIn]);

  const pathsWithNavBar = ["/arena", "/puzzle", "/joke", "/quote", "/happening", "/challenge", "/gooddeed", "/profile", "/approvals"];
  const location = useLocation();

  const ShowNavBar = () => {
    var secondSlashIndex = location.pathname.indexOf("/", location.pathname.indexOf("/") + 1);
    if (secondSlashIndex > 0)
      return pathsWithNavBar.indexOf(location.pathname.substr(0, secondSlashIndex)) > -1;
      
    return pathsWithNavBar.indexOf(location.pathname) > -1;
  };

  if (!appLoaded)
    return <LoadingComponent content="Momenat, aplikacija se ucitava..." />;
  return (
    <Fragment>
      <div style={{pointerEvents: rootStore.allowEvents ? 'all' : 'none' }}>
        <ModalContainer />
        <ToastContainer position="bottom-right" />
        <Route exact path="/" component={WelcomeScreen} />
        <Route
          path={"/(.+)"}
          render={() => (
            <Fragment>
              {ShowNavBar() && <Navbar />}
              <Container style={ ShowNavBar() ? { marginTop: "7em" } : {}}>
                <Switch>
                  <Route
                    path="/users/registerSuccess"
                    component={RegisterSuccess}
                  />
                  <Route path="/users/verifyEmail" component={VerifyEmail} />
                  <PrivateRoute path="/arena" component={ArenaDashboard} />
                  <PrivateRoute path="/gooddeed" component={GoodDeedForm} type={ActivityTypes.GoodDeed} />
                  <PrivateRoute path="/joke" component={JokeForm} type={ActivityTypes.Joke} />
                  <PrivateRoute path="/quote" component={QuoteForm} type={ActivityTypes.Quote} />
                  <PrivateRoute path="/puzzle" component={PuzzleForm} type={ActivityTypes.Puzzle}/>
                  <PrivateRoute path="/happening" component={HappeningForm} type={ActivityTypes.Happening} />
                  <PrivateRoute path="/challenge" component={ChallengeForm} type={ActivityTypes.Challenge}/>
                  <PrivateRoute path="/profile/:username" component={ProfilePage} />
                  <PrivateRoute path="/approvals" component={Approvals} />
                  <Route component={NotFound} />
                </Switch>
              </Container>
            </Fragment>
          )}
        />
      </div>
    </Fragment>
  );
};

export default withRouter(observer(App));

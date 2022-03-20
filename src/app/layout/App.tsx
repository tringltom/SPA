import  './styles.css';

import { Fragment, useEffect } from "react";
import { Redirect, Route, RouteComponentProps, Switch, useLocation, withRouter } from "react-router-dom";

import { ActivityTypes } from "../models/activity";
import Approvals from '../../features/approvals/Approvals';
import ArenaDashboard from "../../features/arena/ArenaDashboard";
import AvatarApprovals from '../../features/approvals/AvatarApprovals';
import ChallengeForm from "../../features/activities/ChallengeForm";
import { ChangePasswordForm } from '../../features/user/ChangePasswordForm';
import { Container } from "semantic-ui-react";
import GoodDeedForm from "../../features/activities/GoodDeedForm";
import HappeningForm from "../../features/activities/HappeningForm";
import JokeForm from "../../features/activities/JokeForm";
import { LoadingComponent } from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";
import Navbar from "../../features/navbar/Navbar";
import NotFound from "./NotFound";
import PrivateRoute from "./PrivateRoute";
import ProfilePage from "../../features/profile/ProfilePage";
import PuzzleForm from "../../features/activities/PuzzleForm";
import QuoteForm from "../../features/activities/QuoteForm";
import RegisterSuccess from "../../features/user/RegisterSuccess";
import { RootStoreContext } from "../stores/rootStore";
import { ToastContainer } from "react-toastify";
import VerifyEmail from "../../features/user/VerifyEmail";
import WelcomeScreen from "../../features/WelcomeScreen";
import { observer } from "mobx-react-lite";
import { useContext } from "react";

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

  const pathsWithNavBar = ["/puzzle", "/joke", "/quote", "/happening", "/challenge", "/gooddeed", "/profile", "/approvals", "/avatarApprovals"];
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
        <Route exact path="/"> {isLoggedIn ? <Redirect to={{pathname: '/arena', state: '/'}}/> : <WelcomeScreen />}</Route>
        <Route
          path={"/(.+)"}
          render={() => (
            <Fragment>
              {ShowNavBar() && <Navbar />}
              <Container style={ ShowNavBar() ? { marginTop: "7em" } : {}} fluid>
                <Switch>
                  <Route path="/users/registerSuccess" component={RegisterSuccess} />
                  <Route path="/users/verifyEmail" component={VerifyEmail} />
                  <Route path="/users/verifyPasswordRecovery" component={ChangePasswordForm} />
                  <PrivateRoute path="/arena" component={ArenaDashboard} />
                  <PrivateRoute path="/gooddeed" component={GoodDeedForm} type={ActivityTypes.GoodDeed} />
                  <PrivateRoute path="/joke" component={JokeForm} type={ActivityTypes.Joke} />
                  <PrivateRoute path="/quote" component={QuoteForm} type={ActivityTypes.Quote} />
                  <PrivateRoute path="/puzzle" component={PuzzleForm} type={ActivityTypes.Puzzle}/>
                  <PrivateRoute path="/happening" component={HappeningForm} type={ActivityTypes.Happening} />
                  <PrivateRoute path="/challenge" component={ChallengeForm} type={ActivityTypes.Challenge}/>
                  <PrivateRoute path="/profile/:id" component={ProfilePage} />
                  <PrivateRoute path="/approvals" component={Approvals} />
                  <PrivateRoute path="/avatarApprovals" component={AvatarApprovals} />
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

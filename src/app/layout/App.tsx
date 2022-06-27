import  './styles.css';
import './style.css'

import { Fragment, useEffect } from "react";
import { Redirect, Route, RouteComponentProps, Switch, useLocation, withRouter } from "react-router-dom";

import ActivityDetails from '../../features/activities/ActivityDetails';
import Approvals from '../../features/approvals/Approvals';
import ArenaDashboard from "../../features/arena/ArenaDashboard";
import AvatarApprovals from '../../features/approvals/AvatarApprovals';
import ChallengeForm from "../../features/activities/ChallengeForm";
import { ChangePasswordForm } from '../../features/user/ChangePasswordForm';
import { Container } from "semantic-ui-react";
import GoodDeedForm from "../../features/activities/GoodDeedForm";
import HappeningCompleteApprovals from '../../features/approvals/HappeningCompleteApprovals';
import HappeningConfirmation from '../../features/activities/HappeningConfirmation';
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
import WelcomeScreen from "../../features/WelcomeScreen";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import TwVerifyEmail from '../../features/user/TwVerifyEmail';

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

  const pathsWithNavBar = ["/puzzle", "/joke", "/quote", "/happening", "/challenge", "/gooddeed", "/activity", "/profile", "/approvals", "/avatarApprovals", "/happeningCompleteApprovals"];
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
      <div style={{ pointerEvents: rootStore.allowEvents ? "all" : "none", height: "100%" }}>
        <ModalContainer />
        <ToastContainer position="bottom-right" />
        <Route exact path="/">
          {" "}
          {isLoggedIn ? (
            <Redirect to={{ pathname: "/arena", state: "/" }} />
          ) : (
            <WelcomeScreen />
          )}
        </Route>
        <Route
          path={"/(.+)"}
          render={() => (
            <Fragment>
              {ShowNavBar() && <Navbar />}
              <Container style={ShowNavBar() ? { marginTop: "7em" } : {}} fluid>
                <Switch>
                  <Route
                    path="/users/registerSuccess"
                    component={RegisterSuccess}
                  />
                  <Route path="/users/verifyEmail" component={TwVerifyEmail} />
                  <Route path="/activities/attendence-confirmation" component={HappeningConfirmation} />
                  <Route
                    path="/users/verifyPasswordRecovery"
                    component={ChangePasswordForm}
                  />
                  <PrivateRoute path="/arena" component={ArenaDashboard} />
                  <PrivateRoute path="/gooddeed/:id?" component={GoodDeedForm} />
                  <PrivateRoute path="/joke/:id?" component={JokeForm} />
                  <PrivateRoute path="/quote/:id?" component={QuoteForm} />
                  <PrivateRoute path="/puzzle/:id?" component={PuzzleForm} />
                  <PrivateRoute path="/happening/:id?" component={HappeningForm} />
                  <PrivateRoute path="/challenge/:id?" component={ChallengeForm} />
                  <PrivateRoute path="/activity/:id/:favorite/:review" component={ActivityDetails} />
                  <PrivateRoute path="/profile/:id" component={ProfilePage} />
                  <PrivateRoute path="/approvals" component={Approvals} />
                  <PrivateRoute path="/avatarApprovals" component={AvatarApprovals} />
                  <PrivateRoute path="/happeningCompleteApprovals" component={HappeningCompleteApprovals} />
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

import { Fragment, useEffect } from "react";
import ModalContainer from "../common/modals/ModalContainer";
import { observer } from "mobx-react-lite";
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Container } from "semantic-ui-react";
import RegisterSuccess from "../../features/user/RegisterSuccess";
import VerifyEmail from "../../features/user/VerifyEmail";
import NotFound from "./NotFound";
import Navbar from "../../features/nav/Navbar";
import  './styles.css';
import ArenaDashboard from "../../features/arena/dashboard/ArenaDashboard";
import PrivateRoute from "./PrivateRoute";
import { useContext } from "react";
import { RootStoreContext } from "../stores/rootStore";
import { LoadingComponent } from "./LoadingComponent";
import WelcomeScreen from "../../features/home/WelcomeScreen";
import PuzzleForm from "../../features/activities/PuzzleForm";
import GoodDeedForm from "../../features/activities/GoodDeedForm";


const App: React.FC<RouteComponentProps> = () => {
  const rootStore = useContext(RootStoreContext);
  const {setAppLoaded, token, appLoaded} = rootStore.commonStore;
  const {getUser, isLoggedIn} = rootStore.userStore;

useEffect(() => {
  if(token ) {
    getUser().finally(() => setAppLoaded())
  } else {
    setAppLoaded();
  }
}, [getUser, setAppLoaded, token])

if (!appLoaded) return <LoadingComponent content='Momenat, aplikacija se ucitava...'/>
  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position="bottom-right" />
      <Route exact path="/" component={WelcomeScreen} />
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            {isLoggedIn && <Navbar />}
            <Container style={{ marginTop: "7em" }}>
              <Switch>
                <Route
                  path="/users/registerSuccess"
                  component={RegisterSuccess}
                />
                <Route path="/users/verifyEmail" component={VerifyEmail} />
                <PrivateRoute path="/arena" component={ArenaDashboard} />
                <PrivateRoute path="/puzzle" component={PuzzleForm} />
                <PrivateRoute path="/gooddeed" component={GoodDeedForm} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));

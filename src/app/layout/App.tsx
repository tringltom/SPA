import { Fragment } from "react";
import ModalContainer from "../common/modals/ModalContainer";
import { observer } from "mobx-react-lite";
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from "react-router-dom";
import { HomePage } from "../../features/home/HomePage";
import { ToastContainer } from "react-toastify";
import { Container } from "semantic-ui-react";
import RegisterSuccess from "../../features/user/RegisterSuccess";
import VerifyEmail from "../../features/user/VerifyEmail";
import NotFound from "./NotFound";

const App: React.FC<RouteComponentProps> = () => {
  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position="bottom-right" />
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <Container style={{ marginTop: "7em" }}>
              <Switch>
                <Route
                  path="/users/registerSuccess"
                  component={RegisterSuccess}
                />
                <Route path="/users/verifyEmail" component={VerifyEmail} />
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

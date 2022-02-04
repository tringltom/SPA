import { observer } from 'mobx-react-lite'
import React from 'react'
import { useContext } from 'react'
import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router-dom'
import { ActivityTypes } from '../models/activity'
import { RootStoreContext } from '../stores/rootStore'


interface IProps extends RouteProps {
    component: React.ComponentType<RouteComponentProps<any>>,
    type?: ActivityTypes
}


const PrivateRoute: React.FC<IProps> = ({component: Component, type, ...rest}) => {
    const rootStore = useContext(RootStoreContext);
    const {isLoggedIn, user} = rootStore.userStore;
    
    return (
      <Route
        {...rest}
        render={(props) =>
          isLoggedIn &&
          (user?.activityCounts.find((el) => el.type === type)
            ?.available ?? 1) > 0 ? (
            <Component {...props} />
          ) : (
            <Redirect to={"/"} />
          )
        }
      />
    );
}

export default observer(PrivateRoute) 

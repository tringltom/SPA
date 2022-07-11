import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router-dom'

import { ActivityTypes } from '../models/activity'
import React from 'react'
import { RootStoreContext } from '../stores/rootStore'
import { observer } from 'mobx-react-lite'
import { useContext } from 'react'

interface IProps extends RouteProps {
    component: React.ComponentType<RouteComponentProps<any>>,
    type?: ActivityTypes
}


const PrivateRoute: React.FC<IProps> = ({component: Component, type, ...rest}) => {
    const rootStore = useContext(RootStoreContext);
    const {isLoggedIn} = rootStore.userStore;
    
    return (
      <Route
        {...rest}
        render={(props) => isLoggedIn ? <Component {...props} /> : <Redirect to="/" />}
      />
    );
}

export default observer(PrivateRoute) 

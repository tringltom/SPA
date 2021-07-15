import React, { useContext, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { RootStoreContext } from '../../app/stores/rootStore'
import queryString from 'query-string'
import agent from '../../app/api/agent'
import { Button, Header, Icon, Segment } from 'semantic-ui-react'
import LoginForm from './LoginForm'
import { toast } from 'react-toastify'

const VerifyEmail: React.FC<RouteComponentProps> = ({location}) => {

    const rootStore = useContext(RootStoreContext);
    const Status = {
        Verifying: 'Verifying',
        Failed: 'Failed',
        Success: 'Success'
    }

    const [status, SetStatus] = useState(Status.Verifying)
    const {openModal} = rootStore.modalStore;
    const {token, email} = queryString.parse(location.search);

    useEffect(() => {
        agent.User.verifyEmail(token as string, email as string).then(() => {
            SetStatus(Status.Success);
        }).catch(() => {
            SetStatus(Status.Failed)
        })
    }, [Status.Failed, Status.Success, token, email])

    const handleConfirmEmailResend = () => {
        agent.User.resendVerifyEmailConfirm(email as string).then(() => {
            toast.success('Potvrda je poslata - molimo Vas da proverite poštu');
        }).catch((error) => console.log(error));
    }
    
    const getBody = () => {
        switch (status) {
          case Status.Verifying:
            return <p>Provera...</p>;
          case Status.Failed:
            return (
              <div className="center">
                <p>
                  Potvrda neuspešna - možete opet da zatražite potvrdu
                  pošta
                </p>
                <Button onClick={handleConfirmEmailResend} primary size="huge" content="Pošalji potvrdu"></Button>
              </div>
            );
          case Status.Success:
            return (
              <div className="center">
                <p>Vaša E-pošta je potvrđena, možete da se ulogujete</p>
                <Button
                  primary
                  onClick={() => openModal(<LoginForm />)}
                  size="large"
                  content="Login"
                ></Button>
              </div>
            );
        }       
    };

    return (
      <Segment placeholder>
        <Header icon>
            <Icon name='envelope'/>
            Potvrda pošte
        </Header>

        <Segment.Inline>
            {getBody()}
        </Segment.Inline>
      </Segment>
    );
}

export default VerifyEmail;
import React from 'react'
import { RouteComponentProps } from 'react-router'
import queryString from 'query-string'
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { toast } from 'react-toastify';

const RegisterSuccess: React.FC<RouteComponentProps> = ({location}) => {

    const {email} = queryString.parse(location.search);

    const handleConfirmEmailResend = () => {
        agent.User.resendVerifyEmailConfirm(email as string).then(() => {
            toast.success('Potvrda je poslata - molimo Vas da proverite poštu');
        }).catch((error) => console.log(error));
    }

    return (
        <Segment>
            <Header icon>
                <Icon name='check'/>
                Uspešno registrovani!
            </Header>
            <Segment.Inline>
                <div className="center">
                    <p>Molimo Vas proverite poštu (uključujući junk fasciklu), stigla Vam je potvrda.</p>
                    {email &&
                        <>
                            <p>Niste dobili potvrdu? Molimo Vas zatražite opet klikom na dugme ispod.</p>
                            <Button onClick={handleConfirmEmailResend} primary content='Pošalji potvrdu' size='huge'/>
                        </>
                    }
                </div>
            </Segment.Inline>
        </Segment>
    )
}

export default RegisterSuccess;

import React from 'react';
import { Segment, Button, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <Segment placeholder>
            <Header icon>
                <Icon name='search' />
                Oops - Svuda smo gledali ali ovu putanju nismo našli.
            </Header>
            <Segment.Inline>
                <Button as={Link} to='/main' primary>
                    Vrati se na glavnu stranu
                </Button>
            </Segment.Inline>
        </Segment>
    );
};

export default NotFound;
import { observer } from 'mobx-react-lite';
import { Button, Container, Menu } from 'semantic-ui-react';

const Navbar = () => {
    return (
     
        <Menu fixed="top" inverted>
          <Container>
            <Menu.Item header>
              <img
                src="/assets/littleOne.png"
                alt=""
                style={{ marginRight: 10 }}
              />
              Ekviti
            </Menu.Item>
            <Menu.Item>
              <Button positive content="Delo" inverted/>
            </Menu.Item>
            <Menu.Item>
              <Button positive content="Vic" inverted/>
            </Menu.Item>
            <Menu.Item>
              <Button positive content="Izreka" inverted/>
            </Menu.Item>
            <Menu.Item>
              <Button positive content="Zagonetka" inverted/>
            </Menu.Item>
            <Menu.Item>
              <Button positive content="Dogadjaj" inverted/>
            </Menu.Item>
            <Menu.Item>
              <Button positive content="Izazov" inverted/>
            </Menu.Item>
            <Menu.Item>
              <Button color="orange" content="Nalog" inverted/>
            </Menu.Item>
          </Container>
        </Menu>
    );
}

export default observer(Navbar);

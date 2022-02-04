import React from 'react'
import { Menu, Grid, GridColumn, Button} from 'semantic-ui-react'

interface IProps {
    leftItems: any,
    rightItems: any
  }

export const NavbarDesktop: React.FC<IProps> = ({ leftItems, rightItems }) => {
    return (
      <Grid>
        <Menu color='blue' inverted fixed='top'>
            <GridColumn>
              <Menu.Item header>
                <img
                  src="/assets/littleOne.png"
                  alt=""
                  style={{ marginRight: 10 }}
                />
                Ekviti
              </Menu.Item>
            </GridColumn>
            {leftItems.map((item: any) => (
              <GridColumn key={item.key + "gc"}>
                <Menu.Item key={item.key + "mi"}>
                  <Button positive inverted {...item} labelPosition='left'/>
                </Menu.Item>
              </GridColumn>
            ))}
            <GridColumn floated="right" className="navUserDropDown">
              <Menu.Menu position="right" style={{ alignItems: "center" }}>
                {rightItems}
              </Menu.Menu>
            </GridColumn>
        </Menu>
      </Grid>
    );
}
        

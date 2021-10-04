import { Fragment, useContext } from 'react';
import { Button, Grid, GridColumn, Image, Segment } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import LoginForm from '../user/LoginForm';
import { RegisterForm } from '../user/RegisterForm';
import { EkvitiColors } from '../../app/layout/EkvitiColors';


const WellcomeScreen = () => {
  const rootStore = useContext(RootStoreContext);
  const { openModal } = rootStore.modalStore;

  const ButtonStyle = {
    width: '85%', height: '100%', borderRadius: 10
  };

  const SegmentStyleLeftPadding = {
    border:0, padding: 0, background: 'transparent', height: '100%', boxShadow: 'none', paddingLeft: '15px'
  };

  const SegmentStyleRightPadding = {
    border:0, padding: 0, background: 'transparent', height: '100%', boxShadow: 'none', paddingRight: '15px'
  };

  const DivWithBackgroundStyle = {
    backgroundImage: "url(/assets/BG.png)", backgroundPosition: 'center', height: '100vh', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'
  };

  const GridColumnStyle = {
    border:0, padding: 0, height: '40%'
  };



    return (
        <Fragment>
          <Grid style={DivWithBackgroundStyle}>

            <Grid.Row style={{padding: 0}}>
              <Grid.Column verticalAlign="bottom">
                  <Image src="/assets/Ekviti_Logo_Registracija.png" style={{minHeight: 30, maxHeight: 250, minWidth: 600}}
                  centered/>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row style={{padding: 0, position: 'relative'}}>
              <Grid.Column>
                <Segment textAlign="center" style={{background: 'transparent', border:0, padding: 0, height: '60%'}}>
                  <h1 className="ekvitiPrimaryFont" style={{fontSize: 60, color: EkvitiColors.primary, paddingTop: 50}}>Za bolje danas!</h1>
                </Segment>

                <Segment style={{border:0, padding: 0, height: '40%'}} inverted color= 'blue'>
                  <Image src="/assets/Vitez_Registracija_Page.png" style={{position: 'absolute', bottom: '3vh', left: '10vw'}}/>
                  <Grid style={{height: '100%'}}>
                      <GridColumn width={4}></GridColumn>
                    <GridColumn width={4} verticalAlign="middle" style={{GridColumnStyle}}>
                      <Segment style={SegmentStyleRightPadding}>
                        <Button className="ekvitiPrimaryFont"  
                          floated="right" size="massive" 
                          inverted style={ButtonStyle} 
                          onClick={() => openModal(<LoginForm />)}>
                            Prijavi se
                        </Button> 
                      </Segment>
                    </GridColumn>
                    <GridColumn width={4} verticalAlign="middle" style={{GridColumnStyle}}>
                      <Segment style={SegmentStyleLeftPadding}>
                        <Button className="ekvitiPrimaryFont" 
                          floated="left" size="massive" 
                          style={ButtonStyle} inverted 
                          onClick={() => openModal(<RegisterForm />)}>
                            Registruj se
                        </Button>
                      </Segment>
                    </GridColumn>
                    <GridColumn width={4}></GridColumn>
                  </Grid>
                </Segment>
              </Grid.Column>

            </Grid.Row>

          </Grid>
        </Fragment>
    );
}

export default WellcomeScreen;



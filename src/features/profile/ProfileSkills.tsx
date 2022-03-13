import { Button, ButtonProps, Grid, GridRow, Header, Icon, Loader, Segment } from 'semantic-ui-react'
import { Fragment, useCallback, useContext, useEffect, useState } from 'react'

import { ActivityTypes } from '../../app/models/activity'
import { ISkillData } from '../../app/models/skillResult';
import ModalYesNo from '../../app/common/modals/ModalYesNo';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';

const ProfileSkills = () => {

  const rootStore = useContext(RootStoreContext);
  const { openModal } = rootStore.modalStore;
  const { skillData, skillMap, initialSkillMap, loadSkills, loadingInitial } = rootStore.profileStore;

  const undoTakenSkills = () => {
    SkillsTaken.forEach((value, skillKey) => {
      toggleMap.forEach((value, key) => {
        if (key === skillKey)
          toggleMap.set(key, false);
      })
    })
    
    setToggleMap(new Map(toggleMap));
    setSkillsTaken(new Map());
    setNumberOfSkillsTaken(0);
  }

  const isSecondTreeActive = () => {
    var active = false;
    toggleMap.forEach((value, key) => {
      if (key.slice(-1) === "4" && value)
        active = true; 
    });
    return active;
  };

  const isThirdTreeActive = () => {
    var active = false;
    toggleMap.forEach((value, key) => {
      if (key.slice(-1) === "7" && value)
        active = true; 
    });
    return active;
  };

  const firstTreeSkillNumberGreaterThen = (number: number) => {
    var count = 0;

    toggleMap.forEach((value, key) => {
      if ((key.slice(-1) === "1" || key.slice(-1) === "2" || key.slice(-1) === "3") && value)
        count++;
    });

    return count > number;
  }

  const secondTreeSkillNumberGreaterThen = (number: number) => {
    var count = 0;

    toggleMap.forEach((value, key) => {
      if ((key.slice(-1) === "4" || key.slice(-1) === "5" || key.slice(-1) === "6") && value)
        count++;
    });
    return count > number;
  }

  const firstAndSecondTreeSkillNumberGreaterThen = (number: number) => {
    var count = 0;

    toggleMap.forEach((value, key) => {
      if (key.slice(-1) !== "7" && value)
        count++;
    });
    return count > number;
  }

  const getAvailablePoints = () => {
    return skillData?.xpLevel! - skillData?.currentLevel! - numberOfSkillsTaken
  }

  const [toggleMap, setToggleMap] = useState(new Map<string, boolean>());
  const [numberOfSkillsTaken, setNumberOfSkillsTaken] = useState(0);
  const [SkillsInitial, setSkillsInitial] = useState(new Map<string, boolean>());
  const [SkillsTaken, setSkillsTaken] = useState(new Map<string, boolean>());

  const handleClick = (el: ButtonProps | undefined) => {
    toggleMap.forEach((value, key) => {
      if (key === el?.id) {
        toggleMap.set(key, !toggleMap.get(key));

        if (toggleMap.get(key)) {
          SkillsTaken.set(key, true);
          setNumberOfSkillsTaken(numberOfSkillsTaken + 1);
        } else {
          SkillsTaken.delete(key);
          setNumberOfSkillsTaken(numberOfSkillsTaken - 1);
        }

        setSkillsTaken(new Map(SkillsTaken));
      }
    });
    setToggleMap(new Map(toggleMap));
  };

  useEffect(() => {
    loadSkills(1);
    console.log(skillMap);
  }, [loadSkills]);
    
  return (
    <Segment clearing>
       {loadingInitial? (
        <Loader active inline='centered'/>
      ) : (
      <Grid columns={4}>
        <Grid.Row>
          <Grid.Column><Header>Broj dodatnih veština: {getAvailablePoints()}</Header></Grid.Column>
          <Grid.Column textAlign="center">I</Grid.Column>
          <Grid.Column textAlign="center">II (minimum 6. nivo)</Grid.Column>
          <Grid.Column textAlign="center">III (minimum 11. nivo)</Grid.Column>
          <Grid.Column textAlign="center">{skillData?.xpLevel!}</Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column></Grid.Column>
          <Grid.Column textAlign="center">Broj aktivnosti nedeljno</Grid.Column>
          <Grid.Column textAlign="center">Uvecanje iskustvenih poena</Grid.Column>
          <Grid.Column textAlign="center">Specijalna titula</Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column></Grid.Column>
          <Grid.Column textAlign="center">
            <Grid columns={3}>
              <Grid.Column>3</Grid.Column>
              <Grid.Column>4</Grid.Column>
              <Grid.Column>5</Grid.Column>
            </Grid>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <Grid columns={3}>
              <Grid.Column>2</Grid.Column>
              <Grid.Column>3</Grid.Column>
              <Grid.Column>4</Grid.Column>
            </Grid>
          </Grid.Column>
          <Grid.Column textAlign="center">?</Grid.Column>
        </Grid.Row>
        {Object.keys(ActivityTypes).map((key: any, el) => {
          if (ActivityTypes[el + 1] !== undefined)
          return (
          <GridRow key={key} textAlign="center">
            <Grid.Column>
              {ActivityTypes[key as keyof typeof ActivityTypes]}
            </Grid.Column>
            <Grid.Column>
              <Grid columns={3}>
                <Grid.Column>
                    <Button id={key + " 1"} size="mini" color = {SkillsInitial.get(key + " 1") ? "blue" : getAvailablePoints() > 0 ? "yellow" : "grey"} disabled = {toggleMap.get(key + " 2") || SkillsInitial.get(key + " 1") || (isSecondTreeActive() && !firstTreeSkillNumberGreaterThen(5) && toggleMap.get(key + " 1")) || (isThirdTreeActive() && !firstAndSecondTreeSkillNumberGreaterThen(10) && toggleMap.get(key + " 1")) || (getAvailablePoints() === 0 && !toggleMap.get(key + " 1"))}  circular toggle active={toggleMap.get(key + " 1") && !SkillsInitial.get(key + " 1")} onClick={(key, el) => handleClick(el)} icon={toggleMap.get(key + " 1") ? <Icon name="checkmark" /> : <Icon name="plus" />}/>
                </Grid.Column>
                <Grid.Column>
                    <Button id={key + " 2"} size="mini" color = {SkillsInitial.get(key + " 2") ? "blue" : toggleMap.get(key + " 1") && getAvailablePoints() > 0 ? "yellow" : "grey"} disabled = {!toggleMap.get(key + " 1") || toggleMap.get(key + " 3") || SkillsInitial.get(key + " 2") || (isSecondTreeActive() && !firstTreeSkillNumberGreaterThen(5) && toggleMap.get(key + " 2")) || (getAvailablePoints() === 0 && !toggleMap.get(key + " 2"))} circular toggle active={toggleMap.get(key + " 2") && !SkillsInitial.get(key + " 2")} onClick={(key, el) => handleClick(el)} icon={toggleMap.get(key + " 2") ? <Icon name="checkmark" /> : <Icon name="plus" />}/>
                </Grid.Column>
                <Grid.Column>
                    <Button id={key + " 3"} size="mini" color = {SkillsInitial.get(key + " 3") ? "blue" : toggleMap.get(key + " 2") && getAvailablePoints() > 0 ? "yellow" : "grey"} disabled = {!toggleMap.get(key + " 2") || toggleMap.get(key + " 4") || SkillsInitial.get(key + " 3") || (isSecondTreeActive() && !firstTreeSkillNumberGreaterThen(5) && toggleMap.get(key + " 3")) || (getAvailablePoints() === 0 && !toggleMap.get(key + " 3"))} circular toggle active={toggleMap.get(key + " 3") && !SkillsInitial.get(key + " 3")} onClick={(key, el) => handleClick(el)} icon={toggleMap.get(key + " 3") ? <Icon name="checkmark" /> : <Icon name="plus" />}/>
                </Grid.Column>
              </Grid>
            </Grid.Column>
            <Grid.Column>
              <Grid columns={3}>
                <Grid.Column>
                <Button id={key + " 4"} size="mini" color = {SkillsInitial.get(key + " 4") ? "blue" : toggleMap.get(key + " 3") && getAvailablePoints() > 0 ? "yellow" : "grey"} disabled = {!toggleMap.get(key + " 3") || toggleMap.get(key + " 5") || SkillsInitial.get(key + " 4") || (skillData?.currentLevel! + numberOfSkillsTaken <= 5) || (isThirdTreeActive() && !secondTreeSkillNumberGreaterThen(4) && toggleMap.get(key + " 4")) || (getAvailablePoints() === 0 && !toggleMap.get(key + " 4"))} circular toggle active={toggleMap.get(key + " 4")  && !SkillsInitial.get(key + " 4")} onClick={(key, el) => handleClick(el)} icon={toggleMap.get(key + " 4") ?  <Icon name="checkmark" /> : <Icon name="plus" />}/>
                </Grid.Column>
                <Grid.Column>
                <Button id={key + " 5"} size="mini" color = {SkillsInitial.get(key + " 5") ? "blue" : toggleMap.get(key + " 4") && getAvailablePoints() > 0 ? "yellow" : "grey"} disabled = {!toggleMap.get(key + " 4") || toggleMap.get(key + " 6") || SkillsInitial.get(key + " 5") || (isThirdTreeActive() && !secondTreeSkillNumberGreaterThen(4) && toggleMap.get(key + " 5")) || (getAvailablePoints() === 0 && !toggleMap.get(key + " 5"))} circular toggle active={toggleMap.get(key + " 5")  && !SkillsInitial.get(key + " 5")} onClick={(key, el) => handleClick(el)} icon={toggleMap.get(key + " 5") ?  <Icon name="checkmark" /> : <Icon name="plus" />}/>
                </Grid.Column>
                <Grid.Column>
                <Button id={key + " 6"} size="mini" color = {SkillsInitial.get(key + " 6") ? "blue" : toggleMap.get(key + " 5") && getAvailablePoints() > 0 ? "yellow" : "grey"} disabled = {!toggleMap.get(key + " 5") || toggleMap.get(key + " 7") || SkillsInitial.get(key + " 6") || (isThirdTreeActive() && !secondTreeSkillNumberGreaterThen(4) && toggleMap.get(key + " 6")) || (getAvailablePoints() === 0 && !toggleMap.get(key + " 6"))} circular toggle active={toggleMap.get(key + " 6")  && !SkillsInitial.get(key + " 6")} onClick={(key, el) => handleClick(el)} icon={toggleMap.get(key + " 6") ?  <Icon name="checkmark" /> : <Icon name="plus" />}/>
                </Grid.Column>
              </Grid>
            </Grid.Column>
            <Grid.Column>
                <Button id={key + " 7"} size="mini" color = {SkillsInitial.get(key + " 7") ? "blue" : toggleMap.get(key + " 6") && getAvailablePoints() > 0 ? "yellow" : "grey"} disabled = {!toggleMap.get(key + " 6") || SkillsInitial.get(key + " 7") || skillData?.currentLevel! + numberOfSkillsTaken <= 10 || (getAvailablePoints() === 0 && !toggleMap.get(key + " 7"))}  circular toggle active={toggleMap.get(key + " 7")  && !SkillsInitial.get(key + " 7")} onClick={(key, el) => handleClick(el)} icon={toggleMap.get(key + " 7") ?  <Icon name="checkmark" /> : <Icon name="plus" />}/>   
            </Grid.Column>
          </GridRow>
          )
        else
            return null
        } 
        )}
        <Grid.Row>
        <Grid.Column textAlign='center'>
          {
            SkillsInitial.size > 0 && (
            <Button
              size="small"
              color="blue"
              content="Resetuj sve"
              onClick={() => openModal(
                <ModalYesNo
                  content="Resetovanje veština"
                  icon="redo" 
                  handleConfirmation={function (values: any): Promise<any> {
                    throw new Error('Function not implemented.');
                  }}           
                />
            )}/>
            )
          }
        </Grid.Column>
        <Grid.Column></Grid.Column>
        <Grid.Column></Grid.Column>
        <Grid.Column textAlign='center'>
        {SkillsTaken.size > 0 && (
          <Fragment>
          <Button
          size="small"
          color="red"
          content="Odustani"
          onClick={() => undoTakenSkills()}
          />
          <Button
          positive
          content="Potvrdi"onClick={() => openModal(
            <ModalYesNo
              content="Potvrda odabira veština"
              icon="chess" 
              handleConfirmation={function (values: any): Promise<any> {
                throw new Error('Function not implemented.');
              }}           
            />
          )}/>
          </Fragment>
        )}
          </Grid.Column>
        </Grid.Row> 
      </Grid>
      )}
    </Segment>
  );
}

export default observer(ProfileSkills);

import { Button, ButtonProps, Grid, GridRow, Header, Icon, Loader, Segment } from 'semantic-ui-react'
import { Fragment, useContext, useEffect, useState } from 'react'
import { ISkillData, ISkillLevel } from "../../app/models/skillResult";

import { ActivityTypes } from '../../app/models/activity'
import ModalYesNo from '../../app/common/modals/ModalYesNo';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';

interface IProps {
  userId: string;
}

const ProfileSkills: React.FC<IProps> = ({ userId }) => {
  const rootStore = useContext(RootStoreContext);
  const { openModal } = rootStore.modalStore;
  const { skillData, skillMap, initialSkillMap, loadSkills, loadingInitial, resetSkills, updateSkills } = rootStore.profileStore;
  const { user } = rootStore.userStore;

  const isProfileOwner = () => Number(userId) === user?.id

  const isSecondTreeActive = () => {
    var active = false;
    skillMap.forEach((value, key) => {
      if (key.slice(-1) === "4" && value)
        active = true; 
    });
    return active;
  };

  const isThirdTreeActive = () => {
    var active = false;
    skillMap.forEach((value, key) => {
      if (key.slice(-1) === "7" && value)
        active = true; 
    });
    return active;
  };

  const firstTreeSkillNumberGreaterThen = (number: number) => {
    var count = 0;

    skillMap.forEach((value, key) => {
      if ((key.slice(-1) === "1" || key.slice(-1) === "2" || key.slice(-1) === "3") && value)
        count++;
    });

    return count > number;
  }

  const secondTreeSkillNumberGreaterThen = (number: number) => {
    var count = 0;

    skillMap.forEach((value, key) => {
      if ((key.slice(-1) === "4" || key.slice(-1) === "5" || key.slice(-1) === "6") && value)
        count++;
    });
    return count > number;
  }

  const firstAndSecondTreeSkillNumberGreaterThen = (number: number) => {
    var count = 0;

    skillMap.forEach((value, key) => {
      if (key.slice(-1) !== "7" && value)
        count++;
    });
    return count > number;
  }

  const getAvailablePoints = () => {
    if (isProfileOwner())
      return skillData?.xpLevel! - skillData?.currentLevel! - numberOfSkillsTaken;
    return 0;
  }

  const [numberOfSkillsTaken, setNumberOfSkillsTaken] = useState(0);
  const [SkillsTaken, setSkillsTaken] = useState(new Map<string, boolean>());

  const handleClick = (el: ButtonProps | undefined) => {
    skillMap.forEach((value, key) => {
      if (key === el?.id) {
        skillMap.set(key, !value);

        if (!value) {
          SkillsTaken.set(key, true);
          setNumberOfSkillsTaken(numberOfSkillsTaken + 1);
        } else {
          SkillsTaken.delete(key);
          setNumberOfSkillsTaken(numberOfSkillsTaken - 1);
        }

        setSkillsTaken(new Map(SkillsTaken));
      }
    });
  };

  const reset = () => {
    resetSkills().then(() => {
      setNumberOfSkillsTaken(0);
      setSkillsTaken(new Map<string, boolean>());
    });
  }

  const update = () => {
    var skillLevels: ISkillLevel[] = [];
    var count = 0;
    var type = 1;
    skillMap.forEach((valueSkill, keySkill) => {
      if (type === Number(keySkill.slice(0, 1))) {
        if (valueSkill) count++;
      } else {
        skillLevels.push({ level: count, type: type });
        count = 0;
        type = Number(keySkill.slice(0, 1));

        if (valueSkill) count++;
      }
    });

    skillLevels.push({ level: count, type: type });

    var newSkillData : ISkillData = {
      currentLevel : skillData!.currentLevel + numberOfSkillsTaken,
      xpLevel: skillData!.xpLevel,
      skillLevels: skillLevels
    }

    updateSkills(newSkillData).then(() => {
      setNumberOfSkillsTaken(0);
      setSkillsTaken(new Map<string, boolean>());
    });
  };

  const undoTakenSkills = () => {
    SkillsTaken.forEach((value, skillKey) => {
      skillMap.forEach((value, key) => {
        if (key === skillKey)
        skillMap.set(key, false);
      })
    })

    setSkillsTaken(new Map());
    setNumberOfSkillsTaken(0);
  }

  useEffect(() => {
    loadSkills(Number(userId));
    console.log(skillMap)
  }, [loadSkills, userId]);
    
  return (
    <Segment clearing>
       {loadingInitial? (
        <Loader active inline='centered'/>
      ) : (
      <Grid columns={4}>
        <Grid.Row>
          <Grid.Column>{isProfileOwner() && <Header>Broj dodatnih veština: {getAvailablePoints()}</Header>}</Grid.Column>
          <Grid.Column textAlign="center">I</Grid.Column>
          <Grid.Column textAlign="center">II (minimum 6. nivo)</Grid.Column>
          <Grid.Column textAlign="center">III (minimum 11. nivo)</Grid.Column>
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
                    <Button id={key + " 1"} size="mini" color = {initialSkillMap.get(key + " 1") ? "blue" : getAvailablePoints() > 0 ? "yellow" : "grey"} disabled = {skillMap.get(key + " 2") || initialSkillMap.get(key + " 1") || (isSecondTreeActive() && !firstTreeSkillNumberGreaterThen(5) && skillMap.get(key + " 1")) || (isThirdTreeActive() && !firstAndSecondTreeSkillNumberGreaterThen(10) && skillMap.get(key + " 1")) || (getAvailablePoints() === 0 && !skillMap.get(key + " 1"))}  circular toggle active={skillMap.get(key + " 1") && !initialSkillMap.get(key + " 1")} onClick={(key, el) => handleClick(el)} icon={skillMap.get(key + " 1") ? <Icon name="checkmark" /> : <Icon name="plus" />}/>
                </Grid.Column>
                <Grid.Column>
                    <Button id={key + " 2"} size="mini" color = {initialSkillMap.get(key + " 2") ? "blue" : skillMap.get(key + " 1") && getAvailablePoints() > 0 ? "yellow" : "grey"} disabled = {!skillMap.get(key + " 1") || skillMap.get(key + " 3") || initialSkillMap.get(key + " 2") || (isSecondTreeActive() && !firstTreeSkillNumberGreaterThen(5) && skillMap.get(key + " 2")) || (isThirdTreeActive() && !firstAndSecondTreeSkillNumberGreaterThen(10) && skillMap.get(key + " 2")) || (getAvailablePoints() === 0 && !skillMap.get(key + " 2"))} circular toggle active={skillMap.get(key + " 2") && !initialSkillMap.get(key + " 2")} onClick={(key, el) => handleClick(el)} icon={skillMap.get(key + " 2") ? <Icon name="checkmark" /> : <Icon name="plus" />}/>
                </Grid.Column>
                <Grid.Column>
                    <Button id={key + " 3"} size="mini" color = {initialSkillMap.get(key + " 3") ? "blue" : skillMap.get(key + " 2") && getAvailablePoints() > 0 ? "yellow" : "grey"} disabled = {!skillMap.get(key + " 2") || skillMap.get(key + " 4") || initialSkillMap.get(key + " 3") || (isSecondTreeActive() && !firstTreeSkillNumberGreaterThen(5) && skillMap.get(key + " 3")) || (isThirdTreeActive() && !firstAndSecondTreeSkillNumberGreaterThen(10) && skillMap.get(key + " 3")) || (getAvailablePoints() === 0 && !skillMap.get(key + " 3"))} circular toggle active={skillMap.get(key + " 3") && !initialSkillMap.get(key + " 3")} onClick={(key, el) => handleClick(el)} icon={skillMap.get(key + " 3") ? <Icon name="checkmark" /> : <Icon name="plus" />}/>
                </Grid.Column>
              </Grid>
            </Grid.Column>
            <Grid.Column>
              <Grid columns={3}>
                <Grid.Column>
                <Button id={key + " 4"} size="mini" color = {initialSkillMap.get(key + " 4") ? "blue" : skillMap.get(key + " 3") && getAvailablePoints() > 0 ? "yellow" : "grey"} disabled = {!skillMap.get(key + " 3") || skillMap.get(key + " 5") || initialSkillMap.get(key + " 4") || (skillData?.currentLevel! + numberOfSkillsTaken <= 5) || (isThirdTreeActive() && !secondTreeSkillNumberGreaterThen(4) && skillMap.get(key + " 4")) || (getAvailablePoints() === 0 && !skillMap.get(key + " 4"))} circular toggle active={skillMap.get(key + " 4")  && !initialSkillMap.get(key + " 4")} onClick={(key, el) => handleClick(el)} icon={skillMap.get(key + " 4") ?  <Icon name="checkmark" /> : <Icon name="plus" />}/>
                </Grid.Column>
                <Grid.Column>
                <Button id={key + " 5"} size="mini" color = {initialSkillMap.get(key + " 5") ? "blue" : skillMap.get(key + " 4") && getAvailablePoints() > 0 ? "yellow" : "grey"} disabled = {!skillMap.get(key + " 4") || skillMap.get(key + " 6") || initialSkillMap.get(key + " 5") || (isThirdTreeActive() && !secondTreeSkillNumberGreaterThen(4) && skillMap.get(key + " 5")) || (getAvailablePoints() === 0 && !skillMap.get(key + " 5"))} circular toggle active={skillMap.get(key + " 5")  && !initialSkillMap.get(key + " 5")} onClick={(key, el) => handleClick(el)} icon={skillMap.get(key + " 5") ?  <Icon name="checkmark" /> : <Icon name="plus" />}/>
                </Grid.Column>
                <Grid.Column>
                <Button id={key + " 6"} size="mini" color = {initialSkillMap.get(key + " 6") ? "blue" : skillMap.get(key + " 5") && getAvailablePoints() > 0 ? "yellow" : "grey"} disabled = {!skillMap.get(key + " 5") || skillMap.get(key + " 7") || initialSkillMap.get(key + " 6") || (isThirdTreeActive() && !secondTreeSkillNumberGreaterThen(4) && skillMap.get(key + " 6")) || (getAvailablePoints() === 0 && !skillMap.get(key + " 6"))} circular toggle active={skillMap.get(key + " 6")  && !initialSkillMap.get(key + " 6")} onClick={(key, el) => handleClick(el)} icon={skillMap.get(key + " 6") ?  <Icon name="checkmark" /> : <Icon name="plus" />}/>
                </Grid.Column>
              </Grid>
            </Grid.Column>
            <Grid.Column>
                <Button id={key + " 7"} size="mini" color = {initialSkillMap.get(key + " 7") ? "blue" : skillMap.get(key + " 6") && getAvailablePoints() > 0 ? "yellow" : "grey"} disabled = {!skillMap.get(key + " 6") || initialSkillMap.get(key + " 7") || skillData?.currentLevel! + numberOfSkillsTaken <= 10 || (getAvailablePoints() === 0 && !skillMap.get(key + " 7"))}  circular toggle active={skillMap.get(key + " 7")  && !initialSkillMap.get(key + " 7")} onClick={(key, el) => handleClick(el)} icon={skillMap.get(key + " 7") ?  <Icon name="checkmark" /> : <Icon name="plus" />}/>   
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
            isProfileOwner() && initialSkillMap.size > 0 && (
            <Button
              size="small"
              color="blue"
              content="Resetuj sve"
              onClick={() => openModal(
                <ModalYesNo
                  content="Resetovanje veština"
                  icon="redo" 
                  handleConfirmation={async () => reset()}           
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
          content="Potvrdi" 
          onClick={() => openModal(
            <ModalYesNo
              content="Potvrda odabira veština"
              icon="chess" 
              handleConfirmation={async () => update()}           
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

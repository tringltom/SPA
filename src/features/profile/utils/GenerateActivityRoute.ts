export const GenerateActivityRoute = (activityType: number, activityId: string) => {
  console.log(activityType)
  let route = ''
  switch (activityType) {
    case 1:
      route = "/gooddeed/"
      break;
    case 2:
      route = "/joke/"
      break
    case 3:
      route = "/quote/"
      break;
    case 4:
      route = "/puzzle/"
      break
    case 5:
      route = "/happening/"
      break
    case 6:
      route = "/challenge/"
      break
    default:
      return '/'
  };
  
  return route + `${activityId}`
};
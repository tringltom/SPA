
export const combineDateAndTime = (date: Date, time: Date) => {
    const dateString = date?.toISOString().split('T')[0];
    const timeString = time?.toISOString().split('T')[1];
    return new Date(dateString + ' ' + timeString).toJSON();
  }

export const parseDate = (dateTime: string) => {
  if (dateTime === "")
    return null
  return new Date(dateTime)
}

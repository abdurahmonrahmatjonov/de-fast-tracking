const formatDate = (dateString) => {
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  return `${day}.${month}.${year}`;
};

export const formatData = (data) => {
  return data.map((item, index) => ({
    docNum: item.docNum,
    docEntry: item.docEntry,
    cardCode: item.cardCode,
    cardName: item.cardName,
    u_numberOfCntr: item.u_numberOfCntr,
    u_China_platform: item.u_China_platform,
    u_numberPlatformKzx: item.u_numberPlatformKzx,
    u_StationOfOperationRailway: item.u_StationOfOperationRailway,
    u_DateOfOperation:
      item.u_DateOfOperation !== null ? formatDate(item.u_DateOfOperation) : "",
    u_LineOfOperation: item.u_LineOfOperation,
    u_DestinationStation: item.u_DestinationStation,
    u_Remaining_km: item.u_Remaining_km,
    u_DispatchPlan:
      item.u_DispatchPlan !== null ? formatDate(item.u_DispatchPlan) : "",
    u_DateSending:
      item.u_DateSending !== null ? formatDate(item.u_DateSending) : "",
  }));
};

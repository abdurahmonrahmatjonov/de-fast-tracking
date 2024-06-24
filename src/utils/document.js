const formatDate = (dateString) => {
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  return `${day}.${month}.${year}`;
};

export const aggregateDocuments = (data) => {
  const aggregatedData = data.reduce((acc, entry) => {
    entry.documentLines.forEach((line) => {
      const key = `${entry.docEntry}`;
      if (!acc[key]) {
        acc[key] = {
          docEntry: entry.docEntry,
          docNum: entry.docNum,
          cardCode: entry.cardCode,
          mijoz: entry.cardName,
          sana: formatDate(entry.docDate),
          docDueDate: entry.docDueDate,
          summa: entry.docTotal,
          ownerCode: entry.ownerCode,
          docTotalQuantity: entry.docTotalQuantity,
          salesPersonCode: entry.salesPersonCode,
          yaratdi: entry.slpName,
          docCur: entry.docCur,
          itemCode: [],
          lineNum: [],
          maxsulot: [],
          baseType: [],
          baseEntry: [],
          baseLine: [],
          quantity: [],
          whsCode: [],
          whsName: [],
          measureUnit: [],
          price: [],
          inventoryQuantity: [],
          discountPercent: [],
          lineTotal: [],
          currency: [],
        };
      }
      acc[key].itemCode.push(line.itemCode);
      acc[key].maxsulot.push(line.itemDescription);
      acc[key].baseType.push(line.baseType);
      acc[key].baseEntry.push(line.baseEntry);
      acc[key].baseLine.push(line.baseLine);
      acc[key].quantity.push(line.quantity);
      acc[key].whsCode.push(line.warehouseCode);
      acc[key].whsName.push(line.whsName);
      acc[key].lineNum.push(line.lineNum);

      acc[key].measureUnit.push(line.measureUnit);
      acc[key].price.push(line.price);
      acc[key].inventoryQuantity.push(line.inventoryQuantity);
      acc[key].discountPercent.push(line.discountPercent);
      acc[key].lineTotal.push(line.lineTotal);
      acc[key].currency.push(line.currency);
    });
    return acc;
  }, {});

  const aggregatedArray = Object.values(aggregatedData);

  aggregatedArray.sort((a, b) => b.docEntry - a.docEntry);

  return aggregatedArray;
};

export const aggregateDocumentsWithDriver = (data) => {
  const aggregatedData = data.reduce((acc, entry) => {
    entry.documentLines.forEach((line) => {
      const key = `${entry.docEntry}`;
      if (!acc[key]) {
        acc[key] = {
          docEntry: entry.docEntry,
          docNum: entry.docNum,
          cardCode: entry.cardCode,
          mijoz: entry.cardName,
          sana: formatDate(entry.docDate),
          docDueDate: entry.docDueDate,
          summa: entry.docTotal,
          ownerCode: entry.ownerCode,
          salesPersonCode: entry.salesPersonCode,
          docTotalQuantity: entry.docTotalQuantity,
          driver: `${entry.driverFirstName} ${entry.driverLastName}`,
          yaratdi: entry.slpName,
          docCur: entry.docCur,
          itemCode: [],
          maxsulot: [],
          baseType: [],
          baseEntry: [],
          lineNum: [],
          baseLine: [],
          quantity: [],
          whsCode: [],
          whsName: [],
          measureUnit: [],
          price: [],
          inventoryQuantity: [],
          discountPercent: [],
          lineTotal: [],
          currency: [],
        };
      }
      acc[key].itemCode.push(line.itemCode);
      acc[key].maxsulot.push(line.itemDescription);
      acc[key].baseType.push(line.baseType);
      acc[key].baseEntry.push(line.baseEntry);
      acc[key].baseLine.push(line.baseLine);
      acc[key].lineNum.push(line.lineNum);
      acc[key].quantity.push(line.quantity);
      acc[key].whsCode.push(line.warehouseCode);
      acc[key].whsName.push(line.whsName);
      acc[key].measureUnit.push(line.measureUnit);
      acc[key].price.push(line.price);
      acc[key].inventoryQuantity.push(line.inventoryQuantity);
      acc[key].discountPercent.push(line.discountPercent);
      acc[key].lineTotal.push(line.lineTotal);
      acc[key].currency.push(line.currency);
    });
    return acc;
  }, {});

  const aggregatedArray = Object.values(aggregatedData);

  aggregatedArray.sort((a, b) => b.docEntry - a.docEntry);

  return aggregatedArray;
};

export const formattedDataDebtor = (data) => {
  return data.map((item, index) => ({
    region: item.region,
    realizators: item.realizators,
    balanceFirstDayOfTheMonth: item.balanceFirstDayOfTheMonth,
    purchasedProduct: item.purchasedProduct,
    paidMoney: item.paidMoney,
    balance: item.currentAccountBalance,
    totalAmountReceived: item.totalAmountReceived,
    balanceLastDayOfTheMonth: item.balanceLastDayOfTheMonth,
    salesPerson: item.salesPerson,
    moneySpeed: item.moneySpeed,
  }));
};


export const formattedTracking = (data) => {

  return data.map((item, index) => ({
    dscription: item.dscription,
    itmsGrpNam: item.itmsGrpNam,
    quantity: item.quantity,
    unitMsr: item.unitMsr,
    invQty: item.invQty,
    ugpName: item.ugpName,
    u_typeOfTransport: item.u_typeOfTransport,
    u_tracking: item.u_tracking,
    u_numberOfTransport: item.u_numberOfTransport,
    docDate: item.docDate,

  }));
};

export  const calculateTotalTracking = (data) => {
  const totals = data.reduce((acc, item) => {
    acc.quantity += item.quantity;
    acc.invQty += item.invQty;

    return acc;
  }, {
    quantity: 0,
    invQty: 0,
  });

  return totals;
};


export const formattedShippedReports = (data) => {

  return data.map((item, index) => ({
    dscription: item.dscription,
    itmsGrpNam: item.itmsGrpNam,
    totalQuantity: item.totalQuantity,
    unitMsr: item.unitMsr,
    totalInvQty: item.totalInvQty,
    ugpName: item.ugpName,
    docDueDate: item.docDueDate,

  }));
};

export  const calculateTotal = (data) => {
  const totals = data.reduce((acc, item) => {
    acc.totalQuantity += item.totalQuantity;
    acc.totalInvQty += item.totalInvQty;

    return acc;
  }, {
    totalQuantity: 0,
    totalInvQty: 0,
  });

  return totals;
};

export  const calculateTotals = (data) => {
  const totals = data.reduce((acc, item) => {
    acc.balanceFirstDayOfTheMonth += item.balanceFirstDayOfTheMonth;
    acc.purchasedProduct += item.purchasedProduct;
    acc.paidMoney += item.paidMoney;
    acc.balance += item.currentAccountBalance;
    acc.totalAmountReceived += item.totalAmountReceived;
    acc.balanceLastDayOfTheMonth += item.balanceLastDayOfTheMonth;
    acc.moneySpeed += item.moneySpeed;
    return acc;
  }, {
    balanceFirstDayOfTheMonth: 0,
    purchasedProduct: 0,
    paidMoney: 0,
    balance: 0,
    totalAmountReceived: 0,
    balanceLastDayOfTheMonth: 0,
    moneySpeed: 0,
  });

  return totals;
};
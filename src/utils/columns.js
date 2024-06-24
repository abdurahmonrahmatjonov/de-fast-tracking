import { Button } from 'antd';
export function column(t, getColumnSearchProps, driver = false) {
  const columns = [
    {
      title: t("mijoz"),
      dataIndex: "mijoz",
      key: "mijoz",
      ...getColumnSearchProps("mijoz"),
    },
    {
      title: t("numZakaz"),
      dataIndex: "docNum",
      key: "docNum",
      ...getColumnSearchProps("docNum"),
    },
    {
      title: t("date"),
      dataIndex: "sana",
      key: "sana",
      ...getColumnSearchProps("sana"),
    },
    {
      title: t("priceSum"),
      dataIndex: "summa",
      key: "summa",
      // ...getColumnSearchProps("summa"),
    },
    {
      title: t("creator"),
      dataIndex: "yaratdi",
      key: "yaratdi",
      ...getColumnSearchProps("yaratdi"),
    },
  ];

  if (driver) {
    columns.push({
      title: t("driver"),
      dataIndex: "driver",
      key: "driver",
    });
  }

  return columns;
}


export function column2(t, getColumnSearchProps, driver = false,action=false) {
  const columns = [
    {
      title: t("mijoz"),
      dataIndex: "mijoz",
      key: "mijoz",
      ...getColumnSearchProps("mijoz"),
    },
    {
      title: t("numZakaz"),
      dataIndex: "docNum",
      key: "docNum",
      ...getColumnSearchProps("docNum"),
    },
    {
      title: t("date"),
      dataIndex: "sana",
      key: "sana",
      ...getColumnSearchProps("sana"),
    },
    {
      title: t("priceSum"),
      dataIndex: "summa",
      key: "summa",
    },
    {
      title: t("creator"),
      dataIndex: "yaratdi",
      key: "yaratdi",
      ...getColumnSearchProps("yaratdi"),
    },
  ];

  if (driver) {
    columns.push({
      title: t("driver"),
      dataIndex: "driver",
      key: "driver",
    });
  }
  if(action){
    columns.push(
      {
        title: t("ship"),
        key: "action",
        render: () => <Button>{t("ship")}</Button>,
      },
    )
  }

  return columns;
}

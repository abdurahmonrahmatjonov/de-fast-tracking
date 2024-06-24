import React from "react";
import { Modal, Input, Select, Table } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const RowDataModal = ({ visible, data, onClose, driver = false }) => {
  const { t } = useTranslation();
  if (!data) return null;
    const formattedSumma = new Intl.NumberFormat("fr-FR").format(
      data.summa
    );


  const columns = [
    {
      title: t("item"),
      dataIndex: "maxsulot",
      key: "maxsulot",
    },
    {
      title: t("quantity"),
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) => {
        const formattedText = new Intl.NumberFormat("fr-FR").format(
          text
        );
        return `${formattedText} `;
      },
    },
    {
      title: t("measureUnit"),
      dataIndex: "measureUnit",
      key: "measureUnit",
    },
    {
      title: t("price"),
      dataIndex: "price",
      key: "price",
      render: (text, record) => {
        const formattedText = new Intl.NumberFormat("fr-FR").format(
          text
        );
        return `${formattedText} ${data.currency[0]}`;
      },
    },
    {
      title: t("inventoryQuantity"),
      dataIndex: "inventoryQuantity",
      key: "inventoryQuantity",
    },
    {
      title: t("totalMiqdor"),
      dataIndex: "lineTotal",
      key: "lineTotal",
      render: (text, record) => {
        const formattedText = new Intl.NumberFormat("fr-FR").format(
          text
        );
        return `${formattedText} ${data.docCur}`;
      },
    },
  ];

  const tableData = data.maxsulot.map((item, index) => ({
    key: index,
    maxsulot: item,
    quantity: data.quantity[index],
    measureUnit: data.measureUnit[index],
    price: data.price[index],
    inventoryQuantity: data.inventoryQuantity[index],
    lineTotal: data.lineTotal[index],
  }));

  return (
    <Modal
      title={
        <h1 className="font-nunito text-xl font-extrabold text-[#000000]">
          {t("order")} № {data.docNum}
        </h1>
      }
      visible={visible}
      onCancel={onClose}
      footer={null}
      closeIcon={<CloseOutlined />}
      width="80%"
      bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
    >
      <div className="w-full px-4 sm:px-14">
        <div className="w-full">
          <div className="mt-4 flex flex-col justify-between sm:mt-10 sm:flex-row">
            <div className="flex flex-col gap-3">
              <p className="font-nunito">{t("mijoz")}</p>
              <Input
                type="text"
                value={data.mijoz}
                className="flex h-12 w-full items-center justify-center sm:w-[250px]"
                disabled
              />
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:mt-0">
              <p className="font-nunito">{t("date")}</p>
              <Input defaultValue={data.sana} disabled />
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            className="border-1 mt-4 w-full border-black sm:mt-12"
            scroll={{ x: "100%" }}
          />

          <div className="mt-5 flex items-center justify-end gap-5">
            <div className="flex flex-col gap-3">
              <p>{t("docTotalQuantity")}</p>
              <Input
                type="text"
                value={`${data.docTotalQuantity} кг`}
                className="flex h-10 w-full items-center justify-center border-[1px] border-[#D0D0D0] active:border-[#D0D0D0] sm:w-[200px]"
                disabled
              />
            </div>

            <div className="flex flex-col gap-3">
              <p>{t("totalPrice")}</p>
              <Input
                type="text"
                value={`${formattedSumma} ${data.currency[0]}`}
                className="flex h-10 w-full items-center justify-center border-[1px] border-[#D0D0D0] active:border-[#D0D0D0] sm:w-[200px]"
                disabled
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col justify-between sm:mt-10 sm:flex-row">
            <div className="flex flex-col gap-3">
              <p>{t("whs")}</p>
              <Select
                defaultValue={data.whsName}
                className="flex h-12 w-full items-center justify-center sm:w-[200px]"
                disabled
              />
            </div>

            {driver ? (
              <div className="flex flex-col gap-3">
                <p>{t("driver")}</p>
                <Select
                  defaultValue={data.driver}
                  className="flex h-12 w-full items-center justify-center sm:w-[200px]"
                  disabled
                />
              </div>
            ) : (
              ""
            )}

            <div className="mt-4 flex flex-col gap-3 sm:mt-0">
              <p>{t("responsiblePerson")}</p>
              <Input
                type="text"
                value={data.yaratdi}
                disabled
                className="flex h-12 w-full items-center justify-center border-[1px] border-[#D0D0D0] sm:w-[200px]"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RowDataModal;

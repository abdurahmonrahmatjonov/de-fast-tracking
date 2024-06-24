import Navbar from "./navbar";
import { useTranslation } from "react-i18next";
import { Table } from "antd";

function Header({
  title,
  currentPage,
  handlePreviousPage,
  handleNextPage,
  hasMoreData,
  columns,
  fdata,
  loading,
  handleRowClick,
  onBtnClick,
}) {
  const { t } = useTranslation();
  return (
    <div className="h-screen w-full overflow-y-auto">
      <Navbar />
      <h1 className="font-poppins ml-4 mt-10 text-xl font-bold text-black sm:ml-10 sm:mt-14 sm:text-2xl">
        {t(title)}
      </h1>
      <div className="mt-10 w-full border-[1px] border-[#E8E8E8] sm:mt-14"></div>

      {onBtnClick && (
        <div className="mt-6 flex w-full items-center justify-end gap-4 px-4 sm:mt-10 sm:gap-7 sm:px-10">
          <button
            onClick={onBtnClick}
            className="h-[40px] w-[150px] rounded-2xl bg-[#0A4D68] text-white sm:w-[200px]"
          >
            {t("Add")}
          </button>
        </div>
      )}

      <div className="ml-4 mt-6 sm:ml-10 sm:mt-10">
        {handleNextPage && (
          <div className="mb-4 flex flex-col justify-between sm:flex-row">
            <div className="font-nunitto font-bold">
              {t("page")} : {currentPage}
            </div>
            <div className="mt-2 flex gap-2 sm:mr-10">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="h-[40px] w-[100px] rounded-2xl bg-gray-300 text-gray-700 disabled:bg-gray-200 disabled:text-gray-400 sm:w-[100px]"
              >
                {t("previous")}
              </button>
              <button
                onClick={handleNextPage}
                disabled={!hasMoreData}
                className="h-[40px] w-[100px] rounded-2xl bg-[#0A4D68] text-white disabled:bg-gray-200 disabled:text-gray-400 sm:w-[100px]"
              >
                {t("next")}
              </button>
            </div>
          </div>
        )}

        <div >
      <Table
        columns={columns}
        dataSource={fdata}
        pagination={false}
        className="mt-6 w-full sm:mt-10"
        rowKey="zakaz"
        sticky={true}
        loading={loading}
        {...(handleRowClick && {
          onRow: (record) => ({
            onClick: () => handleRowClick(record),
          }),
        })}
      />
      </div>
      </div>
    </div>
  );
}

export default Header;

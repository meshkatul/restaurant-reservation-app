import React from "react";
import { useHistory } from "react-router";
import { unSeatTable } from "../utils/api";

function TableCard({ table }) {
  const history = useHistory();

  const handleFinishClick = async (event) => {
    event.preventDefault();
    const message =
      "Is this table ready to seat new guests? This cannot be undone.";
    try {
      if (window.confirm(message)) {
        await unSeatTable(table.table_id);
        history.go(0);
      }
    } catch (error) {
      return error;
    }
  };

  function statusText() {
    if (table.reservation_id) {
      return "occupied";
    } else {
      return "free";
    }
  }

  function statusColor() {
    if (table.reservation_id) {
      return "primary";
    } else {
      return "success";
    }
  }

  return (
    <div className="card text-dark bg-light mb-3" style={{ width: "250px" }}>
      {/* card header: table name */}
      <div className="card-header pb-0">
        <h5 className="card-title text-center">Table: {table.table_name}</h5>
      </div>
      {/* card body */}
      <div className="card-body">
        {/* table capacity */}
        <h6 className="table-subtitle text-center mb-2">
          <span className="oi oi-people m-2"></span>
          Capacity: {table.capacity}
        </h6>
        {/* table status */}
        <h6
          className={`table-subtitle text-center mb-2 text-${statusColor()}`}
          data-table-id-status={table.table_id}
        >
          {statusText()}
        </h6>
        {/* button */}
        <div className="text-center">
          {table.reservation_id && (
            <button
              className="btb btn-sm btn-danger text-center"
              data-table-id-finish={table.table_id}
              onClick={handleFinishClick}
            >
              <span className="oi oi-check mr-2" />
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TableCard;

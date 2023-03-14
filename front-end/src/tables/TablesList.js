import React from "react";
import TableCard from "./TableCard";

function TablesList({ tables }) {
  const tablesList = tables.map((table) => {
    return <TableCard key={table.table_id} table={table}  />;
  });

  return (
    <div className="d-flex justify-content-center flex-wrap">{tablesList}</div>
  );
}

export default TablesList;

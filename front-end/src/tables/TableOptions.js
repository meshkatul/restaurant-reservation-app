import React from "react";

//for using in seat reservation component
function TableOptions({ table }) {
  return (
    <option value={table.table_id}>
      {table.table_name} - {table.capacity}
    </option>
  );
}

export default TableOptions;

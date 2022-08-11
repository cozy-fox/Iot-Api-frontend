import React, { useState } from "react";
import { MyTable } from "./MyTable";

function createData(
  id: number,
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { id, name, calories, fat, carbs, protein };
}

function App() {
  const [rows, setRows] = useState([
      createData(1, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
      createData(2, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
      createData(3, 'Eclair', 262, 16.0, 24, 6.0),
      createData(4, 'Cupcake', 305, 3.7, 67, 4.3),
      createData(5, 'Gingerbread', 356, 16.0, 49, 3.9),
  ]);

  return (
    <div className="App">
        <MyTable rows={rows} />
    </div>
  );
}

export default App;

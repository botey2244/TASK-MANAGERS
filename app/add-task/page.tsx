import { Suspense } from "react";
import AddTaskClient from "./AddTaskClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddTaskClient />
    </Suspense>
  );
}

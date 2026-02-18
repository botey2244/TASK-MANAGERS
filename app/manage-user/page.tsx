import { Suspense } from "react";
import ManageUserClient from "./ManageUserClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ManageUserClient />
    </Suspense>
  );
}

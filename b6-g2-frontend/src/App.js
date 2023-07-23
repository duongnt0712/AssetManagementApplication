import "./assets/styles/MainLayout.css";
import React, { Suspense } from "react";

import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./layouts/MainLayout";
import RequireAuth from "./components/RequireAuth/RequireAuth";
const home = React.lazy(() => import("./modules/home/pages/home.js"));
const login = React.lazy(() => import("./modules/login/pages/login.js"));
const Unauthorization = React.lazy(() =>
  import("./modules/unauthorized/pages/unauthorized.js")
);

const assest = React.lazy(() =>
  import("./modules/assetsMangement/pages/assetsMangement.js")
);
const createNewAsset = React.lazy(() =>
  import("./modules/assetsMangement/pages/assetCreate.js")
);
const assetEdit = React.lazy(() =>
  import("./modules/assetsMangement/pages/assetEdit.js")
);
const assignment = React.lazy(() =>
  import("./modules/assignmentManagement/pages/assignmentManagement.js")
);
const assignmentEdit = React.lazy(() =>
  import("./modules/assignmentManagement/pages/assignmentEdit.js")
)

const assignmentUser = React.lazy(() =>
  import("./modules/assignmentManagement/pages/assignmentManagementUser.js")
);
const createAssignment = React.lazy(() =>
  import("./modules/assignmentManagement/pages/createAssignment.js")
);
const user = React.lazy(() =>
  import("./modules/userManagement/pages/userManagement.js")
);
const createNewUser = React.lazy(() =>
  import("./modules/userManagement/pages/userCreate.js")
);
const userEdit = React.lazy(() =>
  import("./modules/userManagement/pages/userEdit.js")
);
const report = React.lazy(() => import("./modules/report/pages/report.js"));
const requestReturnAssets = React.lazy(() =>
  import(
    "./modules/returningRequestManagement/pages/returningRequestMangement.js"
  )
);

const loading = () => <div className="" />;

export const LoadComponent = ({ component: Component }) => (
  <Suspense fallback={loading()}>
    <Component />
  </Suspense>
);
export default function () {
  let component = assignmentUser;
  if (
    localStorage.getItem("user") &&
    JSON.parse(window.localStorage.getItem("user")).role === "STAFF"
  ) {
    component = assignmentUser;
  }
  return (
    <div>
      <Routes>
        <Route
          path="/auth"
          element={<LoadComponent component={Unauthorization} />}
        />
        <Route path="/login" element={<LoadComponent component={login} />} />
        <Route element={<RequireAuth allowedRoles="UNAUTHOR" />}>
          <Route path="/" element={<Main />}>
            <Route path="/" element={<LoadComponent component={component} />} />
            <Route element={<RequireAuth allowedRoles="UNAUTHOR" />}>
              {/* pages that both staff and admin can access */}
            </Route>
            <Route element={<RequireAuth allowedRoles="ADMIN" />}>
              {/* pages that only admin can access  */}
              <Route
                path="/user"
                element={<LoadComponent component={user} />}
              />
              <Route
                path="/asset"
                element={<LoadComponent component={assest} />}
              />
              <Route
                path="/asset/create"
                element={<LoadComponent component={createNewAsset} />}
              />
              <Route
                path="/asset/edit/:code"
                element={<LoadComponent component={assetEdit} />}
              />
              <Route
                path="/user/create"
                element={<LoadComponent component={createNewUser} />}
              />
              <Route
                path="/user/edit/:username"
                element={<LoadComponent component={userEdit} />}
              />
              <Route
                path="/assignment"
                element={<LoadComponent component={assignment} />}
              />
              <Route
                path="/assignment/create"
                element={<LoadComponent component={createAssignment} />}
              />
              <Route
                path="/assignment/edit/:id"
                element={<LoadComponent component={assignmentEdit} />}
              />
              <Route
                path="/return"
                element={<LoadComponent component={requestReturnAssets} />}
              />
              <Route
                path="/report"
                element={<LoadComponent component={report} />}
              />
            </Route>
            <Route element={<RequireAuth allowedRoles="STAFF" />}>
              {/* pages that only staff can access  */}
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

/** 
 

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Chat from "layouts/chat";
import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import NewTransaction from "layouts/new-transaction";
import LoanRequest from "layouts/loan-request";
import Logout from "layouts/authentication/log-out";
import Admin from "layouts/admin";
import EditUser from "layouts/admin/editUser";
import EditProfile from "layouts/profile/edit-profile"

// @mui icons
import Icon from "@mui/material/Icon";

export const links=[
  {
    type: "collapse",
    name: "edit user",
    key: "edit-user",
    icon: <Icon fontSize="small">edit</Icon>,
    route: "/edit-user",
    component: <EditUser />,
  },
  {
    type: "collapse",
    name: "edit profile",
    key: "edit-profile",
    icon: <Icon fontSize="small">edit</Icon>,
    route: "/edit-profile",
    component: <EditProfile />,
  },
]

export const userRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Chat",
    key: "chat",
    icon: <Icon fontSize="small">message</Icon>,
    route: "/chat",
    component: <Chat />,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "new transaction",
    key: "new-transaction",
    icon: <Icon fontSize="small">send</Icon>,
    route: "/newTransaction",
    component: <NewTransaction />,
  },
  {
    type: "collapse",
    name: "loan request",
    key: "loan-request",
    icon: <Icon fontSize="small">send</Icon>,
    route: "/loanRequest",
    component: <LoanRequest />,
  },
  {
    type: "collapse",
    name: "Log out",
    key: "log-out",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/authentication/log-out",
    component: <Logout />,
  },
];
export const adminRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "new transaction",
    key: "new-transaction",
    icon: <Icon fontSize="small">send</Icon>,
    route: "/newTransaction",
    component: <NewTransaction />,
  },
  {
    type: "collapse",
    name: "loan request",
    key: "loan-request",
    icon: <Icon fontSize="small">send</Icon>,
    route: "/loanRequest",
    component: <LoanRequest />,
  },
  {
    type: "collapse",
    name: "admin",
    key: "admin",
    icon: <Icon fontSize="small">work</Icon>,
    route: "/admin",
    component: <Admin />,
  },
  {
    type: "collapse",
    name: "Log out",
    key: "log-out",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/authentication/log-out",
    component: <Logout />,
  },
];
export const logedOffRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
];

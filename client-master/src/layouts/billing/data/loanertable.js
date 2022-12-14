/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDBadge from "components/MDBadge";

import MDButton from "components/MDButton";

import axios from "axios";
import { successPopUp, errorPopUp } from "App";

import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";

import { socket, forMe } from "App"


const statusDict = {
  returned: <MDBadge badgeContent="returned" color="success" variant="gradient" size="sm" />,
  rejected: <MDBadge badgeContent="rejected" color="error" variant="gradient" size="sm" />,
  confirmed: <MDBadge badgeContent="confirmed" color="info" variant="gradient" size="sm" />,
  waitingToConfirm: <MDBadge badgeContent="waiting to confirm" color="secondary" variant="gradient" size="sm" />
}

function getAction(status, loanId) {
  if (status == "waitingToConfirm") {
    return (
      <MDBox mt={3}>
        <Grid container spacing={3}>
          <MDButton variant="text" color="info" onClick={() => {
            // console.log("confirm loanid:", loanId)
            axios.post(
              `http://localhost:2400/user/confirmLoan`,
              { loanId },
              { withCredentials: true }
            )
              .then(res => res.data)
              .then((data) => {
                if (data.success) {
                  successPopUp("confirm loan")
                }
                else {
                  errorPopUp(data.msg)
                }
              })
          }} >confirm</MDButton>
          <MDButton variant="text" color="error" onClick={() => {
            console.log("reject loanid:", loanId)
            axios.post(
              `http://localhost:2400/user/rejectLoan`,
              { loanId },
              { withCredentials: true }
            )
              .then(res => res.data)
              .then((data) => {
                if (data.success) {
                  successPopUp("reject loan")
                }
                else {
                  errorPopUp(data.msg)
                }
              })
          }} >reject</MDButton>
        </Grid>
      </MDBox>
    )
  }
}

function getStatus(x) {
  if (x.isReturned) return "returned"
  if (x.isRejected) return "rejected"
  if (x.isConfirmed) return "confirmed"
  return "waitingToConfirm"
}

export default function Data({ username }) {
  const [loans, setLoans] = useState([])
  const [loanUpdate, setLoanUpdate] = useState(true)
  // {
  //   "_id": "62e92308651038453dd56e11",
  //   "info": "i am the admin, please help !",
  //   "borrower": "admin",
  //   "loaner": "yes",
  //   "dateCreated": "Tue Aug 02 2022 16:13:44 GMT+0300 (???????? ?????????? (??????))",
  //   "amount": 35,
  //   "dateToReturn": "Tue Aug 09 2022 16:13:44 GMT+0300 (???????? ?????????? (??????))",
  //   "isConfirmed": true,
  //   "isRejected": false,
  //   "isReturned": false,
  //   "__v": 0
  // },
  // {
  //   "_id": "62e9236e651038453dd56e24",
  //   "info": "dear admin, help me please ...",
  //   "borrower": "yes",
  //   "loaner": "admin",
  //   "dateCreated": "Tue Aug 02 2022 16:15:26 GMT+0300 (???????? ?????????? (??????))",
  //   "amount": 210,
  //   "dateToReturn": "Tue Aug 09 2022 16:15:26 GMT+0300 (???????? ?????????? (??????))",
  //   "isConfirmed": false,
  //   "isRejected": false,
  //   "isReturned": false,
  //   "__v": 0
  // },
  // {
  //   "_id": "62ea4522f34cf43d6b181864",
  //   "info": "loan checking...",
  //   "borrower": "admin",
  //   "loaner": "yes",
  //   "dateCreated": "Wed Aug 03 2022 12:51:30 GMT+0300 (???????? ?????????? (??????))",
  //   "amount": 5,
  //   "dateToReturn": "Wed Aug 10 2022 12:51:30 GMT+0300 (???????? ?????????? (??????))",
  //   "isConfirmed": true,
  //   "isRejected": false,
  //   "isReturned": true,
  //   "__v": 0,
  //   "returnedDate": "Wed Aug 03 2022 12:56:18 GMT+0300 (???????? ?????????? (??????))"
  // }
  // ])

  useEffect(() => {
    axios(`http://localhost:2400/user/getLoans`, { withCredentials: true })
      .then(res => res.data.loans)
      .then((res) => {
        console.log(res)
        setLoans(res)
      });
  }, [loanUpdate]);

  useEffect(() => {
    socket.on('loan', (message) => {
      // if (forMe(message.dst)) {
        setLoanUpdate(message.date)
      // }
    })
  }, []);

  return {
    loanerColumns: [
      { Header: "borrower", accessor: "borrower", align: "left" },
      { Header: "amount", accessor: "amount", align: "left" },
      { Header: "info", accessor: "info", align: "left" },
      { Header: "date Created", accessor: "dateCreated", align: "center" },
      { Header: "date To Return", accessor: "dateToReturn", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
      { Header: "returned Date", accessor: "returnedDate", align: "center" },
    ],
    loanerRows: loans
      .filter(x => x.loaner == username)
      .map(x => {
        const temp = getStatus(x)
        // x.dateCreated = x.dateCreated.split(" ").slice(1, 4).toString()
        // x.dateToReturn = x.dateToReturn.split(" ").slice(1, 4).toString()
        x.status = statusDict[temp]
        x.action = getAction(temp, x._id)
        // if (x.returnedDate) {
        //   x.returnedDate = x.returnedDate.split(" ").slice(1, 4).toString()
        // }
        return x
      })
  }
}

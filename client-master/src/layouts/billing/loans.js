import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";

import store from "store"

// Data
import loanerTable from "layouts/billing/data/loanertable";
import borrowerTable from "layouts/billing/data/borrowerTable";


function dateFixxer(loans, username)
{
    var temp = [];
    for(const element of loans)
    {
    temp.push({...element});
    }
    // console.log(temp)
    return temp
      .filter(x=> (x.borrower == username || x.loaner == username))
      .map(x => {
        x.dateCreated = x.dateCreated.split(" ").slice(1, 5).toString().replaceAll(",", "-")
        x.dateToReturn = x.dateToReturn.split(" ").slice(1, 5).toString().replaceAll(",", "-")
        if (x.returnedDate) {
          x.returnedDate = x.returnedDate.split(" ").slice(1, 5).toString().replaceAll(",", "-")
        }
        return x
      })
}

export default function Loans() {
    const username = store.getState().user.username
    const { loanerColumns, loanerRows } = loanerTable({ username});

    const { borrowerColumns, borrowerRows } = borrowerTable({ username});
    // const { loanerColumns, loanerRows } = loanerTable({ username});
    // console.log("borrowerRows = ", borrowerRows);

    return (

        <Grid item xs={12} >
            <Grid item xs={12}>
                <Grid container spacing={5}>

                    <Grid item xs={12}>
                        <Card>
                            <MDBox
                                mx={20}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                            >
                                <MDTypography variant="h6" color="white">
                                Loans I requested
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable
                                    table={{ columns: borrowerColumns, rows: dateFixxer(borrowerRows, username) }}
                                    isSorted={false}
                                    entriesPerPage={false}
                                    showTotalEntries={false}
                                    noEndBorder
                                />
                            </MDBox>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox
                                mx={20}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                            >
                                <MDTypography variant="h6" color="white">
                                Loans asked of me
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable
                                    table={{ columns: loanerColumns, rows: dateFixxer(loanerRows, username) }}
                                    isSorted={false}
                                    entriesPerPage={false}
                                    showTotalEntries={false}
                                    noEndBorder
                                />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>

        </Grid>
    )
}

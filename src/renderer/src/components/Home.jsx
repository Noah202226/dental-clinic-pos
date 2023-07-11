import {
  Button,
  ButtonGroup,
  Grid,
  Stack,
  TablePagination,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import Header from './Home/Header'
import PatientList from './Home/PatientList'
import PatientInfo from './Home/PatientInfo'
import Search from './Home/Search'
import Actions from './Home/Actions'

// tables
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import NewExpense from './Home/NewExpense'
import SalesInfo from './Home/SalesInfo'
import { ToastContainer, toast } from 'react-toastify'
import { CloseOutlined, DatasetLinked, ImportExport } from '@mui/icons-material'
import Settings from './Home/Settings'
// import ExportToExcelButton from './Home/ExportToExcelButton'

import ExcelJSButton from './Home/ExcelJs'

const Home = ({ settingsInfo, userInfo }) => {
  const ipcRenderer = window.ipcRenderer

  const [patientsRecord, setPatientsRecord] = useState([])
  const [installmentPatients, setInstallmentPatients] = useState([])

  const [search, setsearch] = useState('')
  const [filterPatientsData, setFilterPatientsData] = useState([])
  const [filteredInstallmentPatientsData, setFilteredInstallmentPatientsData] = useState([])

  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Settings Ref
  const settingModalRef = useRef()

  // Transaction refs
  const transactionReportRef = useRef()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [page2, setPage2] = React.useState(0)
  const [rowsPerPage2, setRowsPerPage2] = React.useState(10)

  const [firstDayOfMonth, setFirstDayOfMonth] = useState()
  const [lastDayOfMonth, setLastDayOfMonth] = useState()

  // Sale Transaction refs
  const saleTransactionRef = useRef()

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  // expense
  const handleChangePageExpense = (event, newPage2) => {
    setPage2(newPage2)
  }

  const handleChangeRowsPerPageExpense = (event) => {
    setRowsPerPage2(+event.target.value)
    setPage2(0)
  }

  const [rows, setRows] = useState([])
  const [filterRows, setfilterRows] = useState([])

  const [expenseRows, setexpenseRows] = useState([])
  const [filterExpenseRows, setfilterExpenseRows] = useState([])

  // Expense Ref
  const expenseModalRef = useRef()

  // Date
  const getFirstAndLastDayOfMonth = () => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1 // Adding 1 since getMonth() returns zero-based month

    // Formatting the first day of the month
    const firstDay = `${year}-${month.toString().padStart(2, '0')}-01`

    // Calculating the last day of the month
    const lastDay = `${year}-${month.toString().padStart(2, '0')}-${new Date(
      year,
      month,
      0
    ).getDate()}`

    return { firstDay, lastDay }
  }

  const { firstDay, lastDay } = getFirstAndLastDayOfMonth()

  const getDataRange = () => {
    // setGoFilter(!goFilter)

    console.log(firstDay, lastDay)
    console.log(firstDayOfMonth, lastDayOfMonth)
    ipcRenderer.send('get-filtered-sales-record', {
      firstDay: firstDayOfMonth,
      lastDay: lastDayOfMonth
    })
    ipcRenderer.send('get-filtered-expenses-record', {
      firstDay: firstDayOfMonth,
      lastDay: lastDayOfMonth
    })
  }

  // Export functions
  const notyetworking = () => {
    toast.warn('Its not yet work. Sorry', {
      position: 'top-center',
      containerId: 'transactionsNofity'
    })
  }

  // search
  useEffect(() => {
    if (isInitialLoad) {
      // Skip running the code on the initial load
      setIsInitialLoad(false)
      return
    }

    const filteredPatients = patientsRecord.filter((patient) =>
      patient.patientName.toLowerCase().includes(search.toLowerCase())
    )
    const filteredInstallmentPatients = installmentPatients.filter((patient) =>
      patient.patientName.toLowerCase().includes(search.toLowerCase())
    )

    setFilterPatientsData(filteredPatients)
    setFilteredInstallmentPatientsData(filteredInstallmentPatients)
  }, [search])

  // Get transaction info
  const [txID, setTxID] = useState()

  // Get selected treatment
  const [dropdownData, setDropdownData] = useState([])
  const [dropDownItems, setDropDownItems] = useState([])
  const [selectedTreatment, setSelectedTreatment] = useState()
  const [selectedTreatmentItem, setSelectedTreatmentItem] = useState()

  // load data
  useEffect(() => {
    // Example usage
    ipcRenderer.send('patients-records')
    ipcRenderer.send('installment-patient-records')
    ipcRenderer.send('getting-dropdown')

    ipcRenderer.on('dropdown-data', (e, args) => {
      const data = JSON.parse(args)

      setDropdownData(data)
      console.log('firstdata: ', data[0].ref)
      setSelectedTreatment(data[0].ref)
    })
    ipcRenderer.on('dropdown-item', (e, args) => {
      const items = JSON.parse(args)
      setDropDownItems(items)
    })
    ipcRenderer.on('treatment-items', (e, args) => {
      const treatmentItems = JSON.parse(args)
      setDropDownItems(treatmentItems)
      setSelectedTreatmentItem(treatmentItems[0]?.itemName)
    })

    ipcRenderer.on('patients', (e, args) => {
      const data = JSON.parse(args)

      setPatientsRecord([])

      data.forEach((doc) => {
        setPatientsRecord((prevDocuments) => [...prevDocuments, doc])
      })
    })

    ipcRenderer.on('installment-patients', (e, args) => {
      const data = JSON.parse(args)
      console.log(data)

      setInstallmentPatients([])

      data.forEach((doc) => {
        setInstallmentPatients((prevDocuments) => [...prevDocuments, doc])
      })
    })

    // Getting sales and expenses
    ipcRenderer.send('get-filtered-sales-record', { firstDay, lastDay })
    ipcRenderer.send('get-filtered-expenses-record', { firstDay, lastDay })

    setFirstDayOfMonth(firstDay)
    setLastDayOfMonth(lastDay)

    ipcRenderer.on('filted-sales', (e, args) => {
      const txs = JSON.parse(args)
      setRows(txs)
      setfilterRows(txs)
    })
    ipcRenderer.on('filted-expenses', (e, args) => {
      const txs = JSON.parse(args)
      setexpenseRows(txs)
      setfilterExpenseRows(txs)
    })
  }, [])

  useEffect(() => {
    ipcRenderer.send('get-treatment-items', selectedTreatment)
  }, [selectedTreatment])

  return (
    <Stack sx={{ background: settingsInfo?.homeBgColor, height: '100%', width: '100%' }}>
      <Header settingsData={settingsInfo} userInfo={userInfo} />

      <Grid container spacing={1} p={1}>
        <Grid item xs={8}>
          <Search search={search} setsearch={setsearch} />
        </Grid>

        <Grid item xs={4}>
          <Actions
            transactionReportRef={transactionReportRef}
            expenseModalRef={expenseModalRef}
            settingModalRef={settingModalRef}
            settingsInfo={settingsInfo}
            userInfo={userInfo}
          />
        </Grid>
      </Grid>

      <Grid container spacing={1} p={1}>
        <Grid item xs={6}>
          <PatientList
            patients={search === '' ? installmentPatients : filteredInstallmentPatientsData}
            settingsInfo={settingsInfo}
          />
        </Grid>

        <Grid item xs={6}>
          <PatientInfo
            dropdownData={dropdownData}
            dropDownItems={dropDownItems}
            selectedTreatment={selectedTreatment}
            setSelectedTreatment={setSelectedTreatment}
            patients={search === '' ? patientsRecord : filterPatientsData}
            settingsInfo={settingsInfo}
          />
        </Grid>
      </Grid>

      <dialog
        ref={transactionReportRef}
        style={{ position: 'relative', zIndex: 9999999, width: '100%', height: '100%' }}
      >
        <Stack flexDirection={'row'} justifyContent={'space-between'}>
          <Typography variant="h4" color={'indigo'} sx={{ textShadow: '2px 2px 2px cyan' }}>
            Transaction Reports
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => transactionReportRef.current.close()}
          >
            <CloseOutlined />
            (ESC)
          </Button>
        </Stack>

        <Stack
          flexDirection={'row'}
          justifyContent={'space-between'}
          mt={1}
          bgcolor={'lightblue'}
          p={2}
        >
          <Stack
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            width={600}
          >
            <Typography variant="h6">Date range:</Typography>
            <TextField
              type="date"
              value={firstDayOfMonth}
              onChange={(e) => setFirstDayOfMonth(e.target.value)}
              size="small"
            />
            <TextField
              type="date"
              size="small"
              value={lastDayOfMonth}
              onChange={(e) => setLastDayOfMonth(e.target.value)}
            />
            <Button variant="contained" onClick={getDataRange}>
              Get Data
              <DatasetLinked />
            </Button>
          </Stack>

          <Stack>
            {/* <ExportToExcelButton sales={filterRows} expenses={filterExpenseRows} /> */}

            <ExcelJSButton
              sales={filterRows}
              expenses={filterExpenseRows}
              firstDay={firstDayOfMonth}
              lastDay={lastDayOfMonth}
            />
          </Stack>
        </Stack>

        <Grid container spacing={0.5}>
          <Grid item xs={7}>
            <TableContainer
              component={Paper}
              sx={{ mt: 1, height: '100%', backgroundColor: 'rgba(20,220,40, .2)' }}
            >
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="center">Patient Name</TableCell>
                    <TableCell align="right">Treatment Rendered</TableCell>
                    <TableCell align="right">Treatment Type</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filterRows
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow
                        onClick={() => {
                          saleTransactionRef.current.showModal()
                          setTxID(row._id)
                        }}
                        key={row._id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          '&:hover': { background: 'rgba(10,10,60,0.2)', color: 'whitesmoke' }
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {new Date(row?.dateTransact).toLocaleString(undefined, {
                            // year: '2-digit',
                            // month: '2-digit',
                            // day: '2-digit',
                            dateStyle: 'short'
                          })}
                        </TableCell>
                        <TableCell align="center" className="capitalize">
                          {row.patientName}
                        </TableCell>
                        <TableCell align="right" className="capitalize">
                          {row.treatmentRendered}
                        </TableCell>
                        <TableCell align="right" className="capitalize">
                          {row.treatmentType}
                        </TableCell>
                        <TableCell align="right">{row.amountPaid}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <caption style={{ captionSide: 'top' }}>
                  <Stack
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <Typography>SALES</Typography>
                    <ButtonGroup size="small" variant="text">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setfilterRows(rows)
                        }}
                      >
                        All
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setfilterRows(rows)
                          setfilterRows((prev) =>
                            prev.filter((sale) => sale.treatmentRendered === 'oral-prophylaxis')
                          )
                        }}
                      >
                        Oral Prophylaxis
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setfilterRows(rows)
                          setfilterRows((prev) =>
                            prev.filter((sale) => sale.treatmentRendered === 'oral-surgery')
                          )
                        }}
                      >
                        Oral Surgery
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setfilterRows(rows)
                          setfilterRows((prev) =>
                            prev.filter((sale) => sale.treatmentRendered === 'restorative')
                          )
                        }}
                      >
                        Restorative
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setfilterRows(rows)
                          setfilterRows((prev) =>
                            prev.filter((sale) => sale.treatmentRendered === 'prosthodontics')
                          )
                        }}
                      >
                        Prosthodontics
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setfilterRows(rows)
                          setfilterRows((prev) =>
                            prev.filter((sale) => sale.treatmentRendered === 'orthodontics')
                          )
                        }}
                      >
                        Orthodontics
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setfilterRows(rows)
                          setfilterRows((prev) =>
                            prev.filter((sale) => sale.treatmentRendered === 'endodontics')
                          )
                        }}
                      >
                        Endodontics
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setfilterRows(rows)
                          setfilterRows((prev) =>
                            prev.filter((sale) => sale.treatmentRendered === 'cosmetics')
                          )
                        }}
                      >
                        Cosmetics
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setfilterRows(rows)
                          setfilterRows((prev) =>
                            prev.filter((sale) => sale.treatmentRendered === 'check-up')
                          )
                        }}
                      >
                        Check Up
                      </Button>
                    </ButtonGroup>
                  </Stack>
                </caption>
                <caption style={{ captionSide: 'bottom', textAlign: 'end', fontSize: 18 }}>
                  <Stack
                    flexDirection={'row'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                  >
                    <Typography>No. of transaction: {filterRows.length}</Typography>
                    <Typography>
                      Total Amount: {filterRows.reduce((a, b) => a + b.amountPaid, 0)}
                    </Typography>
                  </Stack>
                </caption>
              </Table>

              <TablePagination
                rowsPerPageOptions={[-1]}
                component="div"
                count={filterRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage=""
                showFirstButton={true}
                showLastButton={true}
              />
            </TableContainer>
          </Grid>

          {/* Expenses */}
          <Grid item xs={5}>
            <TableContainer
              component={Paper}
              sx={{ mt: 1, height: '100%', backgroundColor: 'lightblue' }}
            >
              <Table sx={{ minWidth: 50, width: '95%' }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="center">Expense Name</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filterExpenseRows
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow
                        onClick={() => {
                          getSalesTransactionInfo(row._id)
                          saleTransactionRef.current.showModal()
                        }}
                        key={row._id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          '&:hover': { background: 'rgba(10,10,60,0.2)', color: 'whitesmoke' }
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {new Date(row?.dateTransact).toLocaleString(undefined, {
                            // year: '2-digit',
                            // month: '2-digit',
                            // day: '2-digit',
                            dateStyle: 'short'
                          })}
                        </TableCell>
                        <TableCell align="center">{row.expenseName}</TableCell>
                        <TableCell align="right">{row.amountPaid}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <caption style={{ captionSide: 'top' }}>
                  <Stack
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <Typography>EXPENSES</Typography>

                    <ButtonGroup size="small" variant="text">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setfilterExpenseRows(expenseRows)
                        }}
                      >
                        All
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setfilterExpenseRows(expenseRows)
                          setfilterExpenseRows((prev) =>
                            prev.filter((sale) => sale.expenseName === 'Meralco')
                          )
                        }}
                      >
                        Meralco
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setfilterExpenseRows(expenseRows)
                          setfilterExpenseRows((prev) =>
                            prev.filter((sale) => sale.expenseName === 'Internet')
                          )
                        }}
                      >
                        Internet
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setfilterExpenseRows(expenseRows)
                          setfilterExpenseRows((prev) =>
                            prev.filter((sale) => sale.expenseName === 'Prime Water')
                          )
                        }}
                      >
                        Prime Water
                      </Button>
                    </ButtonGroup>
                  </Stack>
                </caption>
                <caption style={{ captionSide: 'bottom', textAlign: 'end', fontSize: 18 }}>
                  <Stack
                    flexDirection={'row'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                  >
                    <Typography>No. of transaction: {filterExpenseRows.length}</Typography>
                    <Typography>
                      Total Amount: {filterExpenseRows.reduce((a, b) => a + b.amountPaid, 0)}
                    </Typography>
                  </Stack>
                </caption>
              </Table>

              <TablePagination
                rowsPerPageOptions={[1]}
                component="div"
                count={filterExpenseRows.length}
                rowsPerPage={rowsPerPage2}
                page={page2}
                onPageChange={handleChangePageExpense}
                onRowsPerPageChange={handleChangeRowsPerPageExpense}
                labelRowsPerPage=""
                showFirstButton={true}
                showLastButton={true}
              />
            </TableContainer>
          </Grid>
        </Grid>

        <ToastContainer
          autoClose={2000}
          pauseOnFocusLoss={false}
          pauseOnHover={false}
          enableMultiContainer
          containerId={'transactionsNofity'}
        />
      </dialog>

      <SalesInfo
        saleTransactionRef={saleTransactionRef}
        txID={txID}
        firstDay={firstDay}
        lastDay={lastDay}
      />

      <Settings
        settingModalRef={settingModalRef}
        settingInfo={settingsInfo}
        dropDownItems={dropDownItems}
        dropdownData={dropdownData}
        selectedTreatment={selectedTreatment}
        setSelectedTreatment={setSelectedTreatment}
        selectedTreatmentItem={selectedTreatmentItem}
        setSelectedTreatmentItem={setSelectedTreatmentItem}
      />

      <NewExpense expenseModalRef={expenseModalRef} />
    </Stack>
  )
}

export default Home

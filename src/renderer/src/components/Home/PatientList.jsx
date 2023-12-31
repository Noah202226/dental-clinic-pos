import { AddBoxRounded } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  Fade,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  Select,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

const PatientList = ({
  patients,
  isRenderingInstallmentPatients,
  setIsRenderingInstallmentPatients,
  settingsInfo,
  dropdownData,
  dropDownItems,
  selectedTreatment,
  setSelectedTreatment,
  selectedTreatmentItem,
  setSelectedTreatmentItem
}) => {
  const ipcRenderer = window.ipcRenderer

  // For card gives rendering
  let id = 0

  const [dateNow, setDateNow] = useState('')
  useEffect(() => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
    const day = currentDate.getDate().toString().padStart(2, '0')

    const formattedDate = `${year}-${month}-${day}`

    setDateNow(formattedDate)
  }, [])

  const newPatientRef = useRef()
  const patientInfoRef = useRef()

  // const [selectedTreatment, setSelectedTreatment] = useState('')
  // const [options, setOptions] = useState([])

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value
    setSelectedTreatment(selectedValue)

    // // Update options based on the selected value
    // const updatedOptions = getUpdatedOptions(selectedValue)
    // setOptions(updatedOptions)
  }

  const getUpdatedOptions = (selectedValue) => {
    // Perform the logic to retrieve the updated options based on the selected value
    // This can involve making an API call or accessing a predefined set of options
    console.log(selectedValue)
    // Return the updated options
    switch (selectedValue) {
      case 'oral-prophylaxis':
        return ['With Flouride', 'Without Flouride', 'Medical Certificate', 'Moral Bond']
      case 'oral-surgery':
        return ['Extraction', 'Surgery', 'Medicine', 'X-ray']
      case 'prosthodontics':
        return ['Jacket Crown', 'Denture']
      case 'orthodontics':
        return ['Brace Removal', 'Retainer', 'Brace Replacement/Moral Band']
      case 'restorative':
        return ['Anterior', 'Posterior Co', 'Posterior Gic']
      case 'endodontics':
        return ['X-ray', 'Post & Core', 'Anterior', 'Posterior']
      case 'cosmetics':
        return ['Veneers', 'Whitening']
      case 'check-up':
        return ['Checkup']
      default:
        return ['With Flouride', 'Without Flouride', 'Medical Certificate', 'Moral Bond']
    }
  }

  // Input Refs
  const dateTransactRef = useRef()

  const patientNameRef = useRef()
  const patientAddresRef = useRef()
  const ageRef = useRef()

  const treatmentTypeRef = useRef()

  const servicePriceRef = useRef()
  const downpaymentRef = useRef()

  // Input States
  const [dateTransact, setdateTransact] = useState('')

  const [patientID, setPatientID] = useState('')

  const [newTransactionAmount, setNewTransactionAmount] = useState('')

  const [patientName, setPatientName] = useState('')
  const [patientAddress, setPatientAddress] = useState('')
  const [age, setAge] = useState('')

  const [treatmentRendered, setTreatmentRendered] = useState('')
  const [treatmentType, setTreatmentType] = useState('')

  const [servicePrice, setServicePrice] = useState('')
  const [downpayment, setdownpayment] = useState('')

  const [gives, setGives] = useState([])
  const [updatedGives, setUpdatedGives] = useState([])
  const [remainingBal, setremainingBal] = useState('')

  const submitPatient = () => {
    // console.log(treatmentTypeRef.current.children[0].value)
    const data = {
      dateTransact: dateNow,
      patientName: patientNameRef.current.children[1].children[0].value,
      patientAge: ageRef.current.children[1].children[0].value,
      patientAddress: patientAddresRef.current.children[1].children[0].value,
      treatmentRendered: selectedTreatment,
      treatmentType: selectedTreatmentItem,
      servicePrice: servicePriceRef.current.children[1].children[0].value,
      initialPay: downpaymentRef.current.children[1].children[0].value,
      remainingBal:
        servicePriceRef.current.children[1].children[0].value -
        downpaymentRef.current.children[1].children[0].value,
      gives: []
    }

    // const sale = {
    //   dateTransact: dateNow,
    //   patientName: patientNameRef.current.children[1].children[0].value,
    //   treatmentRendered: selectedTreatment,
    //   treatmentType: selectedTreatmentItem,
    //   amountPaid: downpaymentRef.current.children[1].children[0].value
    // }

    // ipcRenderer.send('new-sale-record', sale)
    ipcRenderer.send('new-installment-patient', data)

    // Reset Fields
    patientNameRef.current.children[1].children[0].value = ''
    ageRef.current.children[1].children[0].value = ''
    patientAddresRef.current.children[1].children[0].value = ''

    // servicePriceRef.current.children[1].children[0].value = ''
    // downpaymentRef.current.children[1].children[0].value = ''
  }

  const getPatientInfo = (id, fullName) => {
    console.log(id)

    ipcRenderer.send('get-installment-patient-info', id)
    patientInfoRef.current.showModal()
  }

  const updateData = () => {
    console.log('updating...')
  }
  const deleteInstallmentPatient = () => {
    console.log('deleting ...')
    ipcRenderer.send('delete-installment-patient', patientID)
  }

  const submitNewGive = () => {
    setGives((prev) => [...prev, { givenDate: dateNow, amountGive: newTransactionAmount }])
    setUpdatedGives((prev) => [...prev, { givenDate: dateNow, amountGive: newTransactionAmount }])

    ipcRenderer.send('update-installment-patient-gives', {
      patientID,
      givenDate: dateNow,
      amountGive: newTransactionAmount
    })
    // ipcRenderer.send('update-installment-patient-gives', {
    //   patientID,
    //   gives: updatedGives,
    //   remainingBal: remainingBal - newTransactionAmount
    // })
    const sale = {
      dateTransact: dateNow,
      patientName: patientName,
      treatmentRendered: treatmentRendered,
      treatmentType: treatmentType,
      amountPaid: newTransactionAmount
    }

    ipcRenderer.send('new-sale-record', sale)

    setremainingBal(remainingBal - newTransactionAmount)
  }
  const saveNewGive = () => {
    setGives((prev) => [...prev, { givenDate: dateNow, amountGive: newTransactionAmount }])

    ipcRenderer.send('update-installment-patient-gives', {
      patientID,
      givenDate: dateNow,
      amountGive: newTransactionAmount,
      remainingBal: remainingBal - newTransactionAmount
    })

    // const sale = {
    //   dateTransact: dateNow,
    //   patientName: patientName,
    //   treatmentRendered: treatmentRendered,
    //   treatmentType: treatmentType,
    //   amountPaid: newTransactionAmount
    // }

    // ipcRenderer.send('new-sale-record', sale)
  }

  const deleteGive = (index, amount) => {
    const newData = [...gives]
    newData.splice(index, 1)
    setGives(newData)

    setremainingBal(parseInt(remainingBal) + parseInt(amount))

    console.log({ remainingBal: parseInt(remainingBal) + parseInt(amount) })
    ipcRenderer.send('delete-installment-patient-gives', {
      patientID,
      newGivesArray: newData,
      remainingBal: parseInt(remainingBal) + parseInt(amount)
    })
  }

  useEffect(() => {
    ipcRenderer.on('installment-patient-saved', (e, args) => {
      setIsRenderingInstallmentPatients(true)

      ipcRenderer.send('installment-patient-records')
      toast.success('New patient saved.', {
        position: 'top-center',
        containerId: 'homeToastifyContainer'
      })

      newPatientRef.current.close()
    })

    ipcRenderer.on('installment-patient-info', (e, args) => {
      console.log('get')
      const installmentPatientInfo = JSON.parse(args)

      setPatientID(installmentPatientInfo._id)
      setdateTransact(installmentPatientInfo.dateTransact)
      setPatientName(installmentPatientInfo.patientName)
      setPatientAddress(installmentPatientInfo.patientAddress)
      setAge(installmentPatientInfo.patientAge)

      setTreatmentRendered(installmentPatientInfo.treatmentRendered)
      setTreatmentType(installmentPatientInfo.treatmentType)

      setServicePrice(installmentPatientInfo.servicePrice)
      setdownpayment(installmentPatientInfo.initialPay)

      setGives(installmentPatientInfo.gives)
      setremainingBal(installmentPatientInfo.remainingBal)
    })

    ipcRenderer.on('installment-patient-deleted', (e, args) => {
      setIsRenderingInstallmentPatients(true)
      toast.success('Patient Deleted', {
        position: 'top-center',
        containerId: 'homeToastifyContainer'
      })

      setdateTransact('')
      setPatientName('')
      setPatientAddress('')
      setAge('')

      setTreatmentRendered('')
      setTreatmentType('')

      setServicePrice('')
      setdownpayment('')

      setremainingBal('')

      ipcRenderer.send('installment-patient-records')

      patientInfoRef.current.close()
    })

    ipcRenderer.on('installment-patient-gives-updated', (e, args) => {
      setIsRenderingInstallmentPatients(true)
      toast.success('Patient gives updated.', {
        position: 'top-center',
        containerId: 'gives-nofity'
      })

      ipcRenderer.send('patients-records')
      ipcRenderer.send('installment-patient-records')

      ipcRenderer.send('get-installment-patient-info', args)
    })

    ipcRenderer.on('installment-patient-gives-deleted', (e, args) => {
      setIsRenderingInstallmentPatients(true)

      setIsRenderingInstallmentPatients(true)
      toast.success('Patient Give Deleted', {
        position: 'top-center',
        containerId: 'gives-nofity'
      })

      ipcRenderer.send('installment-patient-records')

      ipcRenderer.send('get-installment-patient-info', args)
    })
  }, [])
  return (
    <>
      <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} mb={0.5}>
        <Typography variant="h5" color={settingsInfo?.homeFontColor}>
          {patients?.length > 0
            ? `${settingsInfo?.containerTitle1}'s`
            : settingsInfo?.containerTitle1}
        </Typography>
        <Button
          size="small"
          variant="contained"
          onClick={() => {
            newPatientRef.current.showModal()
            newPatientRef.current.classList.add('show')
          }}
        >
          <AddBoxRounded sx={{ mr: 0.5 }} />
          New
        </Button>
      </Stack>
      <Paper
        className="scrollable-div"
        sx={{
          background: settingsInfo?.container1BgColor,
          padding: 1,
          overflow: 'auto',
          height: 454
        }}
      >
        {isRenderingInstallmentPatients ? (
          <>
            <Skeleton variant="rectangular" width={'100%'} height={150} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width={'100%'} height={150} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width={'100%'} height={150} sx={{ mb: 1 }} />
          </>
        ) : (
          patients.map((patient) => (
            <Tooltip
              key={patient._id}
              title={`Click to view details for ${patient?.patientName}`}
              placement="top"
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
            >
              <Card
                sx={{
                  mb: 1,
                  cursor: 'pointer',
                  transition: 'all 0.1s',
                  '&:hover': {
                    boxShadow: '4px 4px 8px 4px rgba(20,50,80,5)',
                    marginLeft: 1
                  }
                }}
                onClick={() => getPatientInfo(patient._id, patient.patientName)}
              >
                <Stack display={'flex'} alignItems={'start'} justifyContent={'space-around'}>
                  <Stack flexDirection={'row'} p={1} m={0}>
                    <Typography variant="h6">Patient Name:</Typography>
                    <Typography variant="h5" color={'indigo'} ml={2}>
                      {patient.patientName}
                    </Typography>
                  </Stack>

                  <Grid container>
                    <Grid item xs={6}>
                      <Stack flexDirection={'row'} p={1} mt={-2}>
                        <Typography variant="body">Address:</Typography>
                        <Typography variant="caption2" color={'indigo'} ml={2}>
                          {patient.patientAddress}
                        </Typography>
                      </Stack>

                      <Stack flexDirection={'row'} p={1} mt={-2}>
                        <Typography variant="body">Age:</Typography>
                        <Typography variant="caption2" color={'indigo'} ml={2}>
                          {patient.patientAge}
                        </Typography>
                      </Stack>

                      <Stack flexDirection={'row'} p={1} mt={-2}>
                        <Typography variant="body">Treatment Rendered: </Typography>
                        <Typography
                          variant="caption2"
                          color={'indigo'}
                          ml={2}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          {patient.treatmentRendered}
                        </Typography>
                      </Stack>
                      <Stack flexDirection={'row'} p={1} mt={-2}>
                        <Typography variant="body">Treatment Type: </Typography>
                        <Typography
                          variant="caption2"
                          color={'indigo'}
                          ml={2}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          {patient.treatmentType}
                        </Typography>
                      </Stack>
                    </Grid>

                    <Grid item xs={6} container>
                      <Stack flexDirection={'row'} p={1} mt={-2}>
                        <Typography variant="body">Service Price:</Typography>
                        <Typography variant="caption2" color={'indigo'} ml={2}>
                          {patient.servicePrice}
                        </Typography>
                      </Stack>

                      <Stack flexDirection={'row'} p={1} mt={-2}>
                        <Typography variant="body">Downpayment: </Typography>
                        <Typography variant="caption2" color={'indigo'} ml={2}>
                          {patient.initialPay}
                        </Typography>
                      </Stack>

                      <Stack flexDirection={'row'} p={1} mt={-2}>
                        <Typography variant="body">Total Gives: </Typography>
                        <Typography
                          variant="caption2"
                          color={'indigo'}
                          ml={2}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          {patient.gives?.reduce((a, b) => a + parseInt(b.amountGive), 0)}
                        </Typography>
                      </Stack>

                      <Stack flexDirection={'row'} p={1} mt={-2}>
                        <Typography variant="body">Remaining Balance: </Typography>
                        <Typography
                          variant="caption2"
                          color={'indigo'}
                          ml={2}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          {patient.remainingBal}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Card>
            </Tooltip>
          ))
        )}
      </Paper>

      {/* New Patient Installment */}
      <dialog
        ref={newPatientRef}
        style={{
          position: 'relative',
          zIndex: 9999999,
          width: 800,
          height: 700,
          backgroundImage: 'url("../../resources/dentist.svg")',
          backgroundSize: '200px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom',
          backgroundPositionX: 'right'
        }}
      >
        <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} p={1}>
          <Typography variant="h4">Patient Transactions</Typography>
          <Button variant="contained" color="error" onClick={() => newPatientRef.current.close()}>
            Close
          </Button>
        </Stack>

        <Stack>
          <TextField
            sx={{ mb: 1 }}
            type="date"
            value={dateNow}
            onChange={(e) => setDateNow(e.target.value)}
            InputLabelProps={{ shrink: true }}
            ref={dateTransactRef}
          />
        </Stack>

        {/* <Stack sx={{ width: '100%', height: 150 }}>
            <img src="../../resources/dentist.svg" alt="sample image" />
          </Stack> */}

        <Stack>
          <TextField
            sx={{ mb: 1 }}
            type="text"
            label="Patient Name"
            ref={patientNameRef}
            className="capitalize"
          />
          <TextField
            sx={{ mb: 1 }}
            type="text"
            label="Address"
            ref={patientAddresRef}
            className="capitalize"
          />
          <TextField sx={{ mb: 1 }} type="number" label="Age" ref={ageRef} />
        </Stack>

        <Stack flexDirection={'row'} alignItems={'start'} justifyContent={'space-between'} mb={1}>
          <FormControl fullWidth sx={{ position: 'relative', zIndex: 2 }}>
            <Select
              onChange={handleSelectChange}
              value={selectedTreatment}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              native
              sx={{ position: 'relative', zIndex: 2, width: 200 }}
              fullWidth
            >
              {dropdownData.length > 0 ? (
                dropdownData.map((option, index) => (
                  <option key={index} value={option?.ref}>
                    {option?.itemName}
                  </option>
                ))
              ) : (
                <>
                  <option value={''}>No Data</option>
                </>
              )}
            </Select>

            <FormHelperText>Treatment Rendered</FormHelperText>
          </FormControl>

          <FormControl fullWidth sx={{ position: 'relative', zIndex: 2, mb: 1 }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              native
              sx={{ position: 'relative', zIndex: 2, width: 200 }}
              fullWidth
              value={selectedTreatmentItem}
              onChange={(e) => setSelectedTreatmentItem(e.target.value)}
            >
              {dropDownItems.length > 0 ? (
                dropDownItems.map((option, index) => (
                  <option key={index} value={option?.itemName}>
                    {option?.itemName}
                  </option>
                ))
              ) : (
                <>
                  <option value={''}>No Data</option>
                </>
              )}
            </Select>

            <FormHelperText>Treatment Type</FormHelperText>
          </FormControl>
        </Stack>

        <Stack>
          <TextField sx={{ mb: 1 }} type="number" label="Service Price" ref={servicePriceRef} />
          <TextField sx={{ mb: 1 }} type="number" label="Downpayment" ref={downpaymentRef} />
        </Stack>

        <Button variant="contained" color="info" onClick={submitPatient}>
          Submit
        </Button>
      </dialog>

      {/* Patient Installment Info*/}
      <dialog
        ref={patientInfoRef}
        style={{
          position: 'relative',
          zIndex: 9999999,
          width: 1250,
          height: 700,
          backgroundImage: 'url("../../resources/dentist.svg")',
          backgroundSize: '200px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom',
          backgroundPositionX: 'right'
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={5} sx={{ background: 'rgba(50,200,150, 0.5)', p: 0.5, borderRadius: 1 }}>
            <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography variant="h6">Patient Gives</Typography>

              <Typography variant="caption" color={'coral'} sx={{ fontStyle: 'italic' }}>
                * Click patient give to delete
              </Typography>
            </Stack>

            <Stack flexDirection={'row'} justifyContent={'space-between'}>
              <Typography variant="body">No. of Gives: {gives.length}</Typography>
              <Typography variant="body">
                Total amount given: {gives?.reduce((a, b) => a + parseInt(b.amountGive), 0)}
              </Typography>
              <Typography variant="body">Remaining amount: {remainingBal}</Typography>
            </Stack>

            <Paper
              className="scrollable-div"
              sx={{
                background: 'rgba(50,200,150, 0.5)',
                padding: 0.1,
                overflow: 'auto',
                height: 583,
                mt: 2
              }}
            >
              {gives.map((give, index) => {
                return (
                  <Card
                    key={(id += 1)}
                    sx={{
                      mb: 0.5,
                      p: 0.5,
                      cursor: 'pointer',
                      transition: 'all 0.1s',
                      '&:hover': {
                        boxShadow: '4px 4px 8px 4px rgba(20,50,80,5)',
                        marginLeft: 1
                      }
                    }}
                    onClick={() => deleteGive(index, gives[index].amountGive)}
                  >
                    <Typography variant="h6">Date: {give.givenDate}</Typography>
                    <Typography variant="h6">Amount: {give.amountGive}</Typography>
                  </Card>
                )
              })}
            </Paper>
          </Grid>

          <Grid item xs={7}>
            <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography variant="h5">Patient Information</Typography>
              <Button
                variant="contained"
                color="error"
                onClick={() => patientInfoRef.current.close()}
              >
                Close
              </Button>
            </Stack>

            <Stack sx={{ mt: 1 }}>
              <Typography variant="h6">
                Date of transaction:
                {new Date(dateTransact).toLocaleString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Stack>

            <Stack spacing={2} mt={1}>
              <TextField
                type="text"
                label="Patient Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="text"
                label="Address"
                value={patientAddress}
                onChange={(e) => setPatientAddress(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="number"
                label="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            <Stack
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              padding={2}
            >
              <TextField
                type="text"
                label="Treatment Rendered"
                value={treatmentRendered}
                className="capitalize"
                onChange={(e) => setTreatmentRendered(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="text"
                label="Treatment Type"
                className="capitalize"
                value={treatmentType}
                onChange={(e) => setTreatmentType(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            <Stack
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              padding={2}
            >
              <TextField
                type="number"
                label="Service Price"
                value={servicePrice}
                onChange={(e) => setServicePrice(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="number"
                label="Downpayment"
                value={downpayment}
                onChange={(e) => setdownpayment(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            <Stack
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'flex-end'}
              padding={2}
            >
              <Button variant="contained" color="info" onClick={updateData} sx={{ mr: 2 }}>
                Update
              </Button>
              <Button variant="contained" color="error" onClick={deleteInstallmentPatient}>
                Delete
              </Button>
            </Stack>

            <Card sx={{ background: 'rgba(50,200,150, 0.5)', p: 1, borderRadius: 1, mt: 2 }}>
              <Stack flexDirection={'row'} justifyContent={'space-between'}>
                <Typography variant="h6">New Give</Typography>

                <Button variant="contained" color="info" onClick={saveNewGive}>
                  Submit
                </Button>
              </Stack>

              <Stack flexDirection={'row'} justifyContent={'space-between'}>
                <TextField
                  type="date"
                  label="Date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={dateNow}
                  onChange={(e) => setDateNow(e.target.value)}
                />
                <TextField
                  type="number"
                  label="Amount"
                  value={newTransactionAmount}
                  onChange={(e) => setNewTransactionAmount(e.target.value)}
                />
              </Stack>
            </Card>
          </Grid>
        </Grid>

        <ToastContainer
          autoClose={2000}
          pauseOnFocusLoss={false}
          pauseOnHover={false}
          enableMultiContainer
          containerId={'gives-nofity'}
        />
      </dialog>
    </>
  )
}

export default PatientList

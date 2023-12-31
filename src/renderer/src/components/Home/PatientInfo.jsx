import { AddBoxRounded } from '@mui/icons-material'
import {
  Autocomplete,
  Button,
  Card,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { format } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

const PatientInfo = ({
  patients,
  isRenderingPatients,
  setIsRenderingPatients,
  settingsInfo,
  dropdownData,
  dropDownItems,
  selectedTreatment,
  setSelectedTreatment,
  selectedTreatmentItem,
  setSelectedTreatmentItem
}) => {
  const ipcRenderer = window.ipcRenderer

  const [dateNow, setDateNow] = useState('')
  useEffect(() => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
    const day = currentDate.getDate().toString().padStart(2, '0')

    const formattedDate = `${year}-${month}-${day}`

    setDateNow(formattedDate)
  }, [])

  const newPatientButtonRef = useRef()
  const patientInfoRef = useRef()

  const [patientInfo, setPatientInfo] = useState('')
  const [patientTransactions, setPatientTransactions] = useState([])

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value
    setSelectedTreatment(selectedValue)

    // Update options based on the selected value
    // const updatedOptions = getUpdatedOptions(selectedValue)
    // setOptions(updatedOptions)
  }

  // inputs ref on new patient dialog
  const surnameRef = useRef()
  const givenNameRef = useRef()
  const middleNameRef = useRef()

  const ageRef = useRef()
  const [genderRef, setGenderRef] = useState('')

  const nationalityRef = useRef()
  const civilStatusRef = useRef()

  const occupationRef = useRef()
  const homeAddressRef = useRef()
  const personalContactRef = useRef()

  const emergencyToContactRef = useRef()
  const relationRef = useRef()
  const emergencyToContactNoRef = useRef()

  const medicalHistoryRef = useRef()

  const amountRef = useRef()

  const treatmentTypeRef = useRef()

  // // inputs ref on patient info
  const [fullName, setfullName] = useState('')

  const [age, setage] = useState('')
  const [gender, setgender] = useState('')

  const [birthPlace, setbirthPlace] = useState('')
  const [nationality, setnationality] = useState('')
  const [civilStatus, setcivilStatus] = useState('')

  const [occupation, setoccupation] = useState('')
  const [homeAddress, sethomeAddress] = useState('')
  const [personalContact, setpersonalContact] = useState('')

  const [emergencyToContact, setemergencyToContact] = useState('')
  const [emergencyRelation, setemergencyRelation] = useState('')
  const [emergencyToContactNo, setemergencyToContactNo] = useState('')

  const [medicalHistory, setmedicalHistory] = useState('')

  const [amount, setamount] = useState('')

  const [treatmentType, settreatmentType] = useState('')
  const [txNote, setTxNote] = useState()
  const [toothNumber, setToothNumber] = useState()

  // Submit
  const submitForm = (e) => {
    e.preventDefault()

    // console.log(civilStatusRef.current.children[0].children[1].children[0].value)

    const patientData = {
      dateTransact: dateNow,
      patientName: `${givenNameRef.current.children[1].children[0].value} ${middleNameRef.current.children[1].children[0].value} ${surnameRef.current.children[1].children[0].value}`,
      patientAge: ageRef.current.children[1].children[0].value,
      patientGender: genderRef,
      nationality: nationalityRef.current.children[0].children[1].children[0].value,
      civilStatus: civilStatusRef.current.children[0].children[1].children[0].value,
      occupation: occupationRef.current.children[1].children[0].value,
      address: homeAddressRef.current.children[1].children[0].value,
      personalContact: personalContactRef.current.children[1].children[0].value,
      emergencyToContact: emergencyToContactRef.current.children[1].children[0].value,
      emergencyRelation: relationRef.current.children[1].children[0].value,
      emergencyToContactNo: emergencyToContactNoRef.current.children[1].children[0].value,
      medicalHistory: medicalHistoryRef.current.children[1].children[0].value
    }
    const sale = {
      dateTransact: dateNow,
      patientName: `${givenNameRef.current.children[1].children[0].value} ${middleNameRef.current.children[1].children[0].value} ${surnameRef.current.children[1].children[0].value}`,
      treatmentRendered: selectedTreatment,
      treatmentType: selectedTreatmentItem,
      txNote: txNote,
      toothNumber: toothNumber,
      amountPaid: amountRef.current.children[0].children[0].value
    }

    console.log(patientData)
    // console.log(sale)

    ipcRenderer.send('new-patient-record', patientData)
    ipcRenderer.send('new-sale-record', sale)
    ipcRenderer.send('patients-records')

    newPatientButtonRef.current.close()

    // Reset fields
    givenNameRef.current.children[1].children[0].value = ''
    middleNameRef.current.children[1].children[0].value = ''
    surnameRef.current.children[1].children[0].value = ''
    ageRef.current.children[1].children[0].value = ''
    setGenderRef('male')
    nationalityRef.current.children[0].children[1].children[0].value = ''
    civilStatusRef.current.children[0].children[1].children[0].value = ''
    occupationRef.current.children[1].children[0].value = ''
    homeAddressRef.current.children[1].children[0].value = ''
    personalContactRef.current.children[1].children[0].value = ''
    emergencyToContactRef.current.children[1].children[0].value = ''
    relationRef.current.children[1].children[0].value = ''
    emergencyToContactNoRef.current.children[1].children[0].value = ''
    medicalHistoryRef.current.children[1].children[0].value = ''

    amountRef.current.children[0].children[0].value = ''
    setToothNumber('')
    setTxNote('')
  }

  const newTransactionOnly = () => {
    const sale = {
      dateTransact: dateNow,
      patientName: fullName,
      treatmentRendered: selectedTreatment,
      treatmentType: selectedTreatmentItem,
      txNote,
      toothNumber,
      amountPaid: amount
    }
    ipcRenderer.send('new-sale-record', sale)
    ipcRenderer.send('get-sales-record', fullName)
    ipcRenderer.send('patients-records')
  }

  const getPatientInfo = (id, fullName) => {
    ipcRenderer.send('get-patient-info', id)
    ipcRenderer.send('get-sales-record', fullName)
    patientInfoRef.current.showModal()
  }

  const patientTxInfoRef = useRef()
  const [patientTxID, setPatientTxID] = useState()
  const [patientTxDate, setPatientTxDate] = useState()
  const [patientTxAmount, setPatientTxAmount] = useState()
  const [patientTxTreatmentRendered, setPatientTxTreatmentRendered] = useState()
  const [patientTxTreatmentType, setPatientTxTreatmentType] = useState()
  const [patientTxToothNumber, setPatientTxToothNumber] = useState()
  const [patientTxNote, setPatientTxNote] = useState()

  const getTxInfo = (id) => {
    ipcRenderer.send('get-patient-tx-info', id)

    patientTxInfoRef.current.showModal()
  }

  const deletePatient = () => {
    ipcRenderer.send('delete-patient', patientInfo._id)
  }

  // Update Patient Info
  const updatePatientnfo = () => {
    const id = patientInfo._id

    const updatedData = {
      patientName: fullName,
      patientAge: parseInt(age),
      patientGender: gender,
      placeOfBirth: birthPlace,
      nationality,
      civilStatus,
      occupation,
      address: homeAddress,
      personalContact,
      emergencyToContact,
      emergencyRelation,
      emergencyToContactNo,
      medicalHistory
    }
    console.log(id, updatedData)

    ipcRenderer.send('update-patient-info', { id, updatedData })
  }

  useEffect(() => {
    ipcRenderer.on('patient-info', (e, args) => {
      const data = JSON.parse(args)
      setPatientInfo(data)

      setfullName(data?.patientName)
      setage(data?.patientAge)
      setgender(data?.patientGender)
      setGenderRef(data?.patientGender)

      setnationality(data?.nationality)
      setcivilStatus(data?.civilStatus)

      setoccupation(data?.occupation)
      sethomeAddress(data?.address)
      setpersonalContact(data?.personalContact)

      setemergencyToContact(data?.emergencyToContact)
      setemergencyRelation(data?.emergencyRelation)
      setemergencyToContactNo(data?.emergencyToContactNo)

      setmedicalHistory(data?.medicalHistory)
    })

    ipcRenderer.on('new-patient-record-saved', (e, args) => {
      setIsRenderingPatients(true)
      toast.success(args, {
        position: 'top-center',
        containerId: 'homeToastifyContainer'
      })

      ipcRenderer.send('patients-records')
    })

    ipcRenderer.on('patient-deleted', (e, args) => {
      setIsRenderingPatients(true)
      patientInfoRef.current.close()

      toast.success('Patient Deleted.', {
        position: 'top-center',
        containerId: 'homeToastifyContainer'
      })

      ipcRenderer.send('patients-records')
    })

    ipcRenderer.on('patient-updated', (e, args) => {
      setIsRenderingPatients(true)
      patientInfoRef.current.close()

      toast.success('Patient Info Updated.', {
        position: 'top-center',
        containerId: 'homeToastifyContainer'
      })

      ipcRenderer.send('patients-records')
    })

    ipcRenderer.on('sales-record', (e, args) => {
      const data = JSON.parse(args)

      setPatientTransactions(data)
    })

    ipcRenderer.on('new-sale-saved', (e, args) => {
      toast.success(args, {
        position: 'top-center',
        containerId: 'patientInfoNotify'
      })
    })

    ipcRenderer.on('patient-tx-info', (e, args) => {
      const txData = JSON.parse(args)
      setPatientTxID(txData?._id)
      setPatientTxDate(txData?.dateTransact)
      setPatientTxAmount(txData?.amountPaid)
      setPatientTxTreatmentRendered(txData?.treatmentRendered)
      setPatientTxTreatmentType(txData?.treatmentType)
      setPatientTxToothNumber(txData?.toothNumber)
      setPatientTxNote(txData?.txNote)
    })

    ipcRenderer.on('patient-tx-deleted', (e, args) => {
      toast.success('Patient Tx Deleted', {
        position: 'top-center',
        containerId: 'patientInfoNotify'
      })
      console.log(args)

      ipcRenderer.send('get-sales-record', args.fullName)
      patientTxInfoRef.current.close()
    })
    ipcRenderer.on('patient-sale-tx-updated', (e, args) => {
      toast.success('Patient Tx Updated', {
        position: 'top-center',
        containerId: 'patientInfoNotify'
      })
      console.log(args)
      ipcRenderer.send('get-sales-record', args)
      patientTxInfoRef.current.close()
    })
  }, [])

  return (
    <>
      <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} mb={0.5}>
        <Typography variant="h5" color={settingsInfo?.homeFontColor}>
          {patients?.length > 0
            ? `${settingsInfo?.containerTitle2}'s`
            : settingsInfo?.containerTitle2}
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => newPatientButtonRef.current.showModal()}
        >
          <AddBoxRounded sx={{ mr: 0.5 }} />
          New
        </Button>
      </Stack>
      <Paper
        className="scrollable-div"
        sx={{
          background: settingsInfo?.container2BgColor,
          padding: 1,
          overflow: 'auto',
          height: 454
        }}
      >
        {isRenderingPatients ? (
          <>
            <Skeleton variant="rectangular" width={'100%'} height={60} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width={'100%'} height={60} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width={'100%'} height={60} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width={'100%'} height={60} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width={'100%'} height={60} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width={'100%'} height={60} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width={'100%'} height={60} sx={{ mb: 1 }} />
          </>
        ) : (
          patients.map((patient) => (
            <Card
              key={patient._id}
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
                  <Typography variant="h5" color={'indigo'} className="capitalize">
                    {patient.patientName}
                  </Typography>
                </Stack>

                <Stack flexDirection={'row'} p={1} mt={-3}>
                  <Typography variant="body">Address:</Typography>
                  <Typography variant="caption2" color={'indigo'}>
                    {patient.address}
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          ))
        )}
      </Paper>

      {/* New Patient Dialog */}
      <dialog
        ref={newPatientButtonRef}
        style={{
          position: 'relative',
          zIndex: 9999999,
          width: '100%',
          height: 700,
          backgroundImage: 'url("../../resources/dentist.svg")',
          backgroundSize: '200px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom',
          backgroundPositionX: 'right'
        }}
      >
        <Stack flexDirection={'row'} alignItems={'start'} justifyContent={'space-between'} mb={1}>
          <Typography variant="h6">Patient Record</Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => newPatientButtonRef.current.close()}
          >
            Close
          </Button>
        </Stack>

        <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} mb={1}>
          <Stack
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            mb={1}
          >
            <TextField
              type="text"
              label="Surname"
              ref={surnameRef}
              className="capitalize"
              sx={{ mr: 2 }}
            />
            <TextField
              type="text"
              label="Given Name"
              ref={givenNameRef}
              className="capitalize"
              sx={{ mr: 2 }}
            />
            <TextField
              type="text"
              label="Middle Name"
              ref={middleNameRef}
              className="capitalize"
              sx={{ mr: 2 }}
            />
          </Stack>

          <Stack
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            mb={1}
          >
            <TextField type="number" label="Age" ref={ageRef} sx={{ mr: 2 }} />

            <FormControl sx={{ position: 'relative', zIndex: 2 }}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                native
                sx={{ position: 'relative', zIndex: 2, width: 200 }}
                value={genderRef}
                onChange={(e) => setGenderRef(e.target.value)}
              >
                <option value={'male'}>MALE</option>
                <option value={'female'}>FEMALE</option>
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        <Stack flexDirection={'row'} alignItems={'start'} justifyContent={'space-between'} mb={1}>
          <Stack
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            mb={1}
          >
            <Autocomplete
              disablePortal
              id="combo-box-demo-2"
              options={['Filipino', 'Bisaya', 'Others']}
              sx={{ width: 200, mr: 2 }}
              renderInput={(params) => <TextField {...params} label="Nationality" />}
              ref={nationalityRef}
            />
            {/* <TextField type="text" label="Civil Status" ref={civilStatusRef} className="capitalize" /> */}

            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={['Single', 'Married', 'Widowed']}
              sx={{ width: 200, mr: 2 }}
              renderInput={(params) => <TextField {...params} label="Civil Status" />}
              ref={civilStatusRef}
            />
            <TextField type="text" label="Occupation" ref={occupationRef} className="capitalize" />
          </Stack>

          <Stack
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            mb={1}
          >
            <TextField
              type="text"
              label="Home Address"
              ref={homeAddressRef}
              className="capitalize"
              fullWidth
              sx={{ mr: 2 }}
            />
            <TextField type="number" label="No" ref={personalContactRef} className="capitalize" />
          </Stack>
        </Stack>

        <Stack flexDirection={'row'} alignItems={'start'} justifyContent={'space-between'} mb={1}>
          <Stack
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            mb={1}
          >
            <TextField
              type="text"
              label="Person to contact"
              ref={emergencyToContactRef}
              className="capitalize"
              sx={{ mr: 2 }}
            />
            <TextField
              type="text"
              label="Relation"
              ref={relationRef}
              className="capitalize"
              sx={{ mr: 2 }}
            />
            <TextField
              type="number"
              label="No"
              ref={emergencyToContactNoRef}
              className="capitalize"
              sx={{ mr: 2 }}
            />
          </Stack>

          <Stack
            flexDirection={'row'}
            alignItems={'start'}
            justifyContent={'space-between'}
            mb={1}
            width={'50%'}
          >
            <TextField
              type="text"
              label="Medical and Dental History"
              fullWidth
              ref={medicalHistoryRef}
              className="capitalize"
            />
          </Stack>
        </Stack>

        <Card sx={{ background: 'rgba(50,200,150, 0.5)', p: 1, borderRadius: 1, mt: 1 }}>
          <Stack flexDirection={'row'} alignItems={'start'} justifyContent={'space-between'} mb={1}>
            <Typography variant="h6">Form</Typography>

            <Button variant="contained" onClick={submitForm}>
              Submit
            </Button>
          </Stack>

          <Stack flexDirection={'row'} alignItems={'start'} justifyContent={'space-between'} mb={1}>
            <TextField
              type="date"
              helperText="Date Given"
              value={dateNow}
              onChange={(e) => setDateNow(e.target.value)}
            />
            <TextField type="number" helperText="Amount" fullWidth ref={amountRef} />
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
                {/* <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem> */}

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

            <FormControl fullWidth sx={{ position: 'relative', zIndex: 2 }}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                native
                sx={{ position: 'relative', zIndex: 2, width: 200 }}
                fullWidth
                value={selectedTreatmentItem}
                onChange={(e) => setSelectedTreatmentItem(e.target.value)}
              >
                {/* <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem> */}

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

            <TextField
              sx={{ marginRight: 10, width: '50%' }}
              helperText="Tooth #"
              value={toothNumber}
              onChange={(e) => setToothNumber(e.target.value)}
            />

            <TextField
              fullWidth
              multiline
              helperText="Note"
              value={txNote}
              onChange={(e) => setTxNote(e.target.value)}
            />
          </Stack>
        </Card>
      </dialog>

      {/* Patient Info Dialog */}
      <dialog
        ref={patientInfoRef}
        style={{
          position: 'relative',
          zIndex: 9999999,
          width: 1350,
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
            <Typography variant="h4">Patient Transactions</Typography>
            <Typography variant="h6">No. of transaction : {patientTransactions.length}</Typography>

            <Paper
              className="scrollable-div"
              sx={{
                background: 'rgba(50,200,150, 0.5)',
                padding: 0.1,
                overflow: 'auto',
                height: 583
              }}
            >
              {patientTransactions.map((tx) => (
                <Card
                  key={tx._id}
                  sx={{
                    mb: 1,
                    cursor: 'pointer',
                    transition: 'all 0.1s',
                    '&:hover': {
                      boxShadow: '4px 4px 8px 4px rgba(20,50,80,5)',
                      marginLeft: 1
                    },
                    p: 1
                  }}
                  onClick={() => getTxInfo(tx._id)}
                >
                  <Stack
                    flexDirection={'row'}
                    alignItems={'start'}
                    justifyContent={'space-between'}
                  >
                    <Stack>
                      <Typography variant="h6" fontSize={15}>
                        Date:{' '}
                        {new Date(tx.dateTransact).toLocaleString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                      <Typography variant="h6" fontSize={14}>
                        Amount: {tx.amountPaid}
                      </Typography>
                      <Typography variant="h6" fontSize={14}>
                        Treatment Rendered: {tx.treatmentRendered}
                      </Typography>
                      <Typography variant="h6" fontSize={14}>
                        Treatment Type: {tx.treatmentType}
                      </Typography>
                    </Stack>

                    <Stack sx={{ width: '50%' }} alignContent={'start'} justifyContent={'start'}>
                      <Typography variant="h6" fontSize={14}>
                        Tooth #: {tx?.toothNumber}
                      </Typography>
                      <Typography variant="h6" textAlign={'start'} fontSize={14}>
                        NOTE: {tx?.txNote}
                      </Typography>
                    </Stack>
                  </Stack>
                </Card>
              ))}

              <dialog ref={patientTxInfoRef} style={{ padding: 15 }}>
                <Stack>
                  <Stack
                    flexDirection={'row'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    mb={2}
                  >
                    <Typography variant="h5">Patient transaction info</Typography>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => patientTxInfoRef.current.close()}
                    >
                      Close
                    </Button>
                  </Stack>

                  <TextField
                    type="date"
                    value={format(
                      new Date(patientTxDate ? patientTxDate : new Date(Date.now())),
                      'yyyy-MM-dd'
                    )}
                    onChange={() => {}}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                  />

                  <Stack flexDirection={'row'} sx={{ mb: 2 }}>
                    <TextField
                      label="Treatment Rendered"
                      value={patientTxTreatmentRendered}
                      onChange={(e) => setPatientTxTreatmentRendered(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{ mr: 2 }}
                      disabled
                    />
                    <TextField
                      label="Treatment Type"
                      value={patientTxTreatmentType}
                      onChange={(e) => setPatientTxTreatmentType(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      disabled
                    />
                  </Stack>

                  <Stack flexDirection={'row'} sx={{ mb: 2 }}>
                    <TextField
                      label="Amount"
                      value={patientTxAmount}
                      onChange={(e) => setPatientTxAmount(e.target.value)}
                      sx={{ mr: 2 }}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Tooth Number"
                      value={patientTxToothNumber}
                      onChange={(e) => setPatientTxToothNumber(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>

                  <TextField
                    multiline
                    label="Note"
                    value={patientTxNote}
                    onChange={(e) => setPatientTxNote(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                  />

                  <Stack flexDirection={'row'} justifyContent={'space-between'}>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() =>
                        ipcRenderer.send('update-patient-sale-tx', {
                          id: patientTxID,
                          patientTxDate,
                          patientTxTreatmentRendered,
                          patientTxTreatmentType,
                          patientTxAmount,
                          patientTxToothNumber,
                          patientTxNote,
                          fullName
                        })
                      }
                    >
                      Update
                    </Button>

                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() =>
                        ipcRenderer.send('delete-patient-sale-tx', { id: patientTxID, fullName })
                      }
                    >
                      Delete
                    </Button>
                  </Stack>
                </Stack>
              </dialog>
            </Paper>
          </Grid>

          <Grid item xs={7}>
            <Stack
              flexDirection={'row'}
              alignItems={'start'}
              justifyContent={'space-between'}
              mb={1}
            >
              <Typography variant="h6">Patient Data</Typography>
              <Button
                variant="contained"
                color="error"
                onClick={() => patientInfoRef.current.close()}
              >
                Close
              </Button>
            </Stack>

            <Stack
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              mb={1}
            >
              <TextField
                type="text"
                label="Patient Name"
                className="capitalize"
                value={fullName}
                onChange={(e) => setfullName(e.target.value)}
                InputLabelProps={{ shrink: true }}
                disabled
              />
              <Stack
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
                width={300}
              >
                <Button variant="contained" color="success" onClick={updatePatientnfo}>
                  Update Info
                </Button>
                <Button variant="contained" color="warning" onClick={deletePatient}>
                  Delete Patient
                </Button>
              </Stack>
            </Stack>

            <Stack
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              mb={1}
            >
              <TextField
                type="number"
                label="Age"
                value={age}
                onChange={(e) => setage(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />

              <FormControl fullWidth sx={{ position: 'relative', zIndex: 2 }}>
                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={gender}
                  onChange={(e) => setgender(e.target.value)}
                  native
                  sx={{ position: 'relative', zIndex: 2, width: 150, ml: 2 }}
                >
                  {/* <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem> */}

                  <option value={'male'}>MALE</option>
                  <option value={'female'}>FEMALE</option>
                </Select>
              </FormControl>

              <TextField
                type="text"
                label="Nationality"
                value={nationality}
                onChange={(e) => setnationality(e.target.value)}
                className="capitalize"
                InputLabelProps={{ shrink: true }}
                sx={{ mr: 2 }}
              />
              <TextField
                type="text"
                label="Civil Status"
                className="capitalize"
                value={civilStatus}
                onChange={(e) => setcivilStatus(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            <Stack
              flexDirection={'row'}
              alignItems={'start'}
              justifyContent={'space-between'}
              mb={1}
            >
              <TextField
                type="text"
                label="Occupation"
                className="capitalize"
                value={occupation}
                onChange={(e) => setoccupation(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="text"
                label="Home Address"
                className="capitalize"
                value={homeAddress}
                onChange={(e) => sethomeAddress(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="number"
                label="No"
                value={personalContact}
                onChange={(e) => setpersonalContact(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            <Stack
              flexDirection={'row'}
              alignItems={'start'}
              justifyContent={'space-between'}
              mb={1}
            >
              <TextField
                type="text"
                label="Person to contact"
                className="capitalize"
                value={emergencyToContact}
                onChange={(e) => setemergencyToContact(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="text"
                label="Relation"
                className="capitalize"
                value={emergencyRelation}
                onChange={(e) => setemergencyRelation(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="number"
                label="No"
                value={emergencyToContactNo}
                onChange={(e) => setemergencyToContactNo(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            <Stack
              flexDirection={'row'}
              alignItems={'start'}
              justifyContent={'space-between'}
              mb={1}
            >
              <TextField
                type="text"
                label="Medical and Dental History"
                className="capitalize"
                fullWidth
                value={medicalHistory}
                onChange={(e) => setmedicalHistory(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            <Card sx={{ background: 'rgba(50,200,150, 0.5)', p: 0.5, borderRadius: 1 }}>
              <Stack
                flexDirection={'row'}
                alignItems={'start'}
                justifyContent={'space-between'}
                mb={1}
              >
                <Typography variant="h6">New Transaction form</Typography>

                <Button variant="contained" onClick={newTransactionOnly}>
                  Submit
                </Button>
              </Stack>

              <Stack
                flexDirection={'row'}
                alignItems={'start'}
                justifyContent={'space-between'}
                mb={1}
              >
                <TextField
                  type="date"
                  helperText="Date Given"
                  fullWidth
                  value={dateNow}
                  onChange={(e) => setDateNow(e.target.value)}
                />
                <TextField
                  type="number"
                  helperText="Amount"
                  fullWidth
                  value={amount}
                  onChange={(e) => setamount(e.target.value)}
                />
              </Stack>

              <Stack flexDirection={'column'} alignItems={'start'} justifyContent={'space-between'}>
                <Stack
                  flexDirection={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  width={'100%'}
                >
                  <FormControl fullWidth sx={{ position: 'relative', zIndex: 2 }}>
                    <Select
                      onChange={handleSelectChange}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedTreatment}
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

                  <FormControl fullWidth sx={{ position: 'relative', zIndex: 2 }}>
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

                <Stack
                  flexDirection={'row'}
                  alignItems={'start'}
                  justifyContent={'space-between'}
                  width={'100%'}
                >
                  <TextField
                    helperText="Tooth #"
                    value={toothNumber}
                    onChange={(e) => setToothNumber(e.target.value)}
                    sx={{ mr: 3 }}
                  />
                  <TextField
                    fullWidth
                    helperText="Note"
                    value={txNote}
                    onChange={(e) => setTxNote(e.target.value)}
                    multiline
                  />
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        <ToastContainer
          autoClose={1000}
          pauseOnFocusLoss={false}
          pauseOnHover={false}
          enableMultiContainer
          containerId={'patientInfoNotify'}
        />
      </dialog>
      <ToastContainer
        autoClose={1000}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        enableMultiContainer
        containerId={'homeToastifyContainer'}
      />
    </>
  )
}

export default PatientInfo

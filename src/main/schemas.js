import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  name: String,
  pwd: String,
  accountType: String
  // Other user fields
})

const NewPatientSchema = new Schema({
  dateTransact: Date,
  patientName: String,
  patientAge: Number,
  patientGender: String,
  nationality: String,
  civilStatus: String,
  occupation: String,
  address: String,
  personalContact: Number,
  emergencyToContact: String,
  emergencyRelation: String,
  emergencyToContactNo: Number,
  medicalHistory: String
})

const SaleRecordSchema = new Schema({
  patientName: String,
  dateTransact: Date,
  treatmentRendered: String,
  treatmentType: String,
  amountPaid: Number,
  toothNumber: String,
  txNote: String
})

const InstallmentPatientSchema = new Schema({
  dateTransact: Date,
  patientName: String,
  patientAge: Number,
  patientAddress: String,
  treatmentRendered: String,
  treatmentType: String,
  servicePrice: Number,
  initialPay: Number,
  remainingBal: Number,
  gives: [Object]
})

const ExpenseSchema = new Schema({
  expenseName: String,
  dateTransact: Date,
  amountPaid: Number
})

const SettingSchema = new Schema({
  logoDir: String,
  loginTitle: String,
  loginBgColor: String,
  appTitle: String,
  homeBgColor: String,
  homeFontColor: String,
  containerTitle1: String,
  container1BgColor: String,
  containerTitle2: String,
  container2BgColor: String
})

const DropdownSchema = new Schema({
  itemName: String,
  ref: String
})
const DropdownItem = new Schema({
  itemName: String,
  ref: String
})

const Users = model('users', userSchema)
const NewPatient = model('new-patient', NewPatientSchema)
const NewSale = model('sales-record', SaleRecordSchema)
const InstallmentPatient = model('installment-patient', InstallmentPatientSchema)
const Expenses = model('expenses', ExpenseSchema)
const SettingsData = model('settings', SettingSchema)
const Dropdown = model('dropdown', DropdownSchema)
const DropdownData = model('dropdown-item', DropdownItem)

export {
  Users,
  NewPatient,
  NewSale,
  InstallmentPatient,
  Expenses,
  SettingsData,
  Dropdown,
  DropdownData
}

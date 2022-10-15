const EmploymentItem = props => {
  const {jobDetails, onCheckStatusChange} = props
  const {label, employmentTypeId} = jobDetails
  const onCheckChange = () => {
    onCheckStatusChange(employmentTypeId)
  }

  return (
    <li>
      <input
        type="checkbox"
        id={label}
        onChange={onCheckChange}
        value={employmentTypeId}
      />
      <label htmlFor={label}>{label}</label>
    </li>
  )
}

export default EmploymentItem

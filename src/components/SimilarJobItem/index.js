const SimilarJobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails

  return (
    <li>
      <img src={companyLogoUrl} alt="similar job company logo" />
      <h1>{title}</h1>
      <p>{rating}</p>
      <p>{location}</p>

      <p>{employmentType}</p>
      <p>{packagePerAnnum}</p>
      <p>Description</p>
      <p>{jobDescription}</p>
    </li>
  )
}

export default SimilarJobItem

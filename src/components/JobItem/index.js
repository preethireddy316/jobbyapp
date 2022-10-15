import {Link} from 'react-router-dom'

const JobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails

  return (
    <li>
      <Link to={`/jobs/${id}`}>
        <img src={companyLogoUrl} alt="website logo" />
        <h1>{title}</h1>
        <p>{rating}</p>
        <p>{location}</p>

        <p>{employmentType}</p>
        <p>{packagePerAnnum}</p>
        <p>Description</p>
        <p>{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobItem

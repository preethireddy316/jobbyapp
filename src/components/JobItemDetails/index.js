/* eslint-disable react/no-unknown-property */
import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'
import Header from '../Header'

import SimilarJobItem from '../SimilarJobItem'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class JobItemDetails extends Component {
  state = {
    jobDetailsObj: {},
  }

  componentDidMount() {
    this.getJobData()
  }

  convert1 = obj => ({
    companyLogoUrl: obj.company_logo_url,
    employmentType: obj.employment_type,
    id: obj.id,
    jobDescription: obj.job_description,
    location: obj.location,
    packagePerAnnum: obj.package_per_annum,
    rating: obj.rating,
    companyWebsiteUrl: obj.company_website_url,
  })

  convert2 = obj => ({
    companyLogoUrl: obj.company_logo_url,
    employmentType: obj.employment_type,
    id: obj.id,
    jobDescription: obj.job_description,
    location: obj.location,
    packagePerAnnum: obj.package_per_annum,
    rating: obj.rating,
    title: obj.title,
    companyWebsiteUrl: obj.company_website_url,
  })

  life = obj => ({
    description: obj.description,
    imageUrl: obj.image_url,
  })

  getJobData = async () => {
    this.setState({apiStatus: apiConstants.loading})
    const {match} = this.props
    const {params} = match
    const jwtToken = Cookies.get('jwt_token')
    const {id} = params
    const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(jobDetailsApiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const jobObj = this.convert1(data.job_details)
      const skillsList = data.job_details.skills.map(each => ({
        imageUrl: each.image_url,
        name: each.name,
      }))
      const lifeObj = this.life(data.job_details.life_at_company)
      const similarList = data.similar_jobs.map(each => this.convert2(each))
      const obj = {jobObj, skillsList, lifeObj, similarList}
      this.setState({jobDetailsObj: obj, apiStatus: apiConstants.success})
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {jobDetailsObj} = this.state
    const {jobObj, skillsList, lifeObj, similarList} = jobDetailsObj
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      companyWebsiteUrl,
    } = jobObj
    const {description, imageUrl} = lifeObj
    return (
      <div>
        <img src={companyLogoUrl} alt="job details company logo" />
        <h1>{title}</h1>
        <p>{rating}</p>
        <p>{location}</p>

        <p>{employmentType}</p>
        <p>{packagePerAnnum}</p>
        <br />
        <h1>Description</h1>
        <a href={companyWebsiteUrl}>Visit</a>
        <p>{jobDescription}</p>
        <h1>Skills</h1>
        <ul>
          {skillsList.map(each => (
            <li key={each.name}>
              <img src={each.imageUrl} alt="skill" />
              <p>{each.name}</p>
            </li>
          ))}
          <h1>Life at Company</h1>
          <p>{description}</p>
          <img src={imageUrl} alt="company" />
        </ul>

        <h1>Similar Jobs</h1>
        <ul>
          {similarList.map(each => (
            <SimilarJobItem key={each.id} jobDetails={each} />
          ))}
        </ul>
      </div>
    )
  }

  failureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <p>Something Went Wrong</p>
    </div>
  )

  renderLoader = () => (
    <div className="products-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  differentViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderSuccessView()
      case apiConstants.loading:
        return this.renderLoader()
      case apiConstants.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.differentViews()}
      </>
    )
  }
}

export default JobItemDetails

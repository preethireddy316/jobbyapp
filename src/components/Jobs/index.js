/* eslint-disable react/no-unknown-property */

import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import Profile from '../Profile'
import JobItem from '../JobItem'
import EmploymentItem from '../EmploymentItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

const empList = employmentTypesList.map(each => ({
  ...each,
  isChecked: false,
}))

class Jobs extends Component {
  state = {
    jobsList: [],
    searchInput: '',
    apiStatus: apiConstants.initial,
    employmentList: empList,
    activeSalaryId: '',
  }

  componentDidMount() {
    this.getJobsData()
  }

  onChangeInput = event => this.setState({searchInput: event.target.value},this.getJobsData)

  salaryChange = event => this.setState({activeSalaryId: event.target.value},this.getJobsData)

  convert = obj => ({
    companyLogoUrl: obj.company_logo_url,
    employmentType: obj.employment_type,
    id: obj.id,
    jobDescription: obj.job_description,
    location: obj.location,
    packagePerAnnum: obj.package_per_annum,
    rating: obj.rating,
    title: obj.title,
  })

  getJobsData = async () => {
    this.setState({apiStatus: apiConstants.loading})
    const {employmentList, activeSalaryId, searchInput} = this.state
    const empIdsList = employmentList.filter(each => each.isChecked===true)
    const empType = empIdsList.join()
    console.log(empType)
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${empType}&minimum_package=${activeSalaryId}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(jobsApiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const list = data.jobs.map(each => this.convert(each))
      this.setState({jobsList: [...list], apiStatus: apiConstants.success})
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  onCheckStatusChange = id => {
    const {employmentList} = this.state
    const list = employmentList.map(each => {
      if (each.employmentTypeId === id) {
        return {...each, isChecked: !each.isChecked}
      }
      return each
    })
    this.setState({employmentList: list},this.getJobsData)
  }

  renderJobsFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <p>Something Went Wrong</p>
    </div>
  )

  renderJobsSuccessView = () => {
    const {jobsList} = this.state
    return (
      <ul>
        {jobsList.map(each => (
          <JobItem key={each.id} jobDetails={each} />
        ))}
      </ul>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderJobs = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderJobsSuccessView()
      case apiConstants.failure:
        return this.renderJobsFailureView()
      case apiConstants.loading:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {searchInput, employmentList} = this.state
    return (
      <>
        <Header />
        <div className="container">
          <div>
            <div>
              <Profile />
            </div>
            <br />
            <h1>Type of Employment</h1>
            <ul className="emptype-container">
              {employmentList.map(each => (
                <EmploymentItem
                  key={each.employmentTypeId}
                  jobDetails={each}
                  onCheckStatusChange={this.onCheckStatusChange}
                />
              ))}
            </ul>
            <br />
            <h1>Salary Range</h1>

            <ul className="salary-cont">
              {salaryRangesList.map(each => (
                <li key={each.salaryRangeId}>
                  <input
                    type="radio"
                    id={each.label}
                    name="package"
                    value={each.salaryRangeId}
                    onChange={this.salaryChange}
                  />
                  <label htmlFor={each.label}>{each.label}</label>
                </li>
              ))}
            </ul>

            <br />
          </div>
          <div>
            <input
              type="search"
              value={searchInput}
              onChange={this.onChangeInput}
            />
            <button type="button" testid="searchButton">
              <BsSearch className="search-icon" />
            </button>
            {this.renderJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs

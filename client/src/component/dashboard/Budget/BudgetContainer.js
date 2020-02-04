import React, { useEffect, useState } from 'react'
import ListItemText from '@material-ui/core/ListItemText'
import Box from '@material-ui/core/Box'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress'
import BarChartWrapper from '../Charts/Wrappers/BarChartWrapper'


const Firestore = require('../../../backend/firebase/Firestore').Firestore

export async function fetchUserRiding(userEmail) {
  let result = ''
  await axios
    .get(`http://localhost:5000/api/users/${userEmail}/getUser`)
    .then(res => {
      if (res.data.success) {
        const riding = res.data.data.riding
        result = riding
      }
    })
    .catch(err => console.error(err))
  return result
}

export async function fetchRepresentative(riding) {
  let result = ''
  await axios
    .get(
      `http://localhost:5000/api/representatives/${riding}/getRepresentative`
    )
    .then(res => {
      if (res.data.success) {
        const representative = res.data.data.name
        result = representative
      }
    })
    .catch(err => console.error(err))
  return result
}

export async function fetchRepresentativeId(representative) {
  return axios
    .get(
      `http://localhost:5000/api/representatives/${representative}/getRepresentativeId`
    )
    .then(res => {
      if (res.data.success) {
        return res.data.data
      }
    })
    .catch(console.error)
}
// =========== AVG OFFICE COSTS ============

export async function fetchAverageOfficeSpending() {
  const db = new Firestore()
  const officeSpendingItems = []

  await db
    .FinancialRecord()
    .where('parent', '==', '8-Offices')
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        officeSpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return officeSpendingItems
}

export function computeAverageOfficeSpending(spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  if (total >= 0 && !isNaN(total)) {
    return (total / spendingItems.length) * 9
  } else {
    return null
  }
}

// =========== AVG ADVERTISING COSTS ============

export async function fetchAverageAdvertisingSpending() {
  const db = new Firestore()
  const advertisingSpendingItems = []

  await db
    .FinancialRecord()
    .where('category', '==', '6-Advertising')
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        advertisingSpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return advertisingSpendingItems
}

export function computeAverageAdvertisingSpending(spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  if (total >= 0 && !isNaN(total)) {
    return total / spendingItems.length
  } else {
    return null
  }
}

// =========== AVG EMPLOYEE COSTS ============

export async function fetchAverageEmployeeSpending() {
  const db = new Firestore()
  const employeeSpendingItems = []

  await db
    .FinancialRecord()
    .where('category', '==', "1-Employees' salaries")
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        employeeSpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return employeeSpendingItems
}

export function computeAverageEmployeeSpending(spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  if (total >= 0 && !isNaN(total)) {
    return total / spendingItems.length
  } else {
    return null
  }
}

// =========== AVG GIFTS COSTS ============

export async function fetchAverageGiftsSpending() {
  const db = new Firestore()
  const giftsSpendingItems = []

  const [riding, setRiding] = useState(null)
  useEffect(() => {
    async function getData () {
      if (user) {
        const riding = await fetchUserRiding(user.email)
        setRiding(riding)
      }
    }
    getData()
  }, [user])

  async function fetchUserRiding (userEmail) {
    return axios
      .get(`http://localhost:5000/api/users/${userEmail}/getUser`)
      .then(res => {
        if (res.data.success) {
          return res.data.data.riding
        }
      })
    .catch(err => {
      console.log('Error getting documents', err)
    })
}

export function computeAverageGiftsSpending(spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  if (total >= 0 && !isNaN(total)) {
    return total / spendingItems.length
  } else {
    return null
  }
}

// =========== AVG HOSPITALITY COSTS ============

export async function fetchAverageHospitalitySpending() {
  const db = new Firestore()
  const hospitalitySpendingItems = []

  const [representative, setRepresentative] = useState(null)
  useEffect(() => {
    async function getData () {
      if (riding) {
        const rep = await fetchRepresentative(riding)
        setRepresentative(rep)
      }
    }
    getData()
  }, [riding])

  async function fetchRepresentative (riding) {
    return axios
      .get(
        `http://localhost:5000/api/representatives/${riding}/getRepresentative`
      )
      .then(res => {
        if (res.data.success) {
          return res.data.data.name
        }
      })
    .catch(err => {
      console.log('Error getting documents', err)
    })
}

export function computeAverageHospitalitySpending(spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  if (total >= 0 && !isNaN(total)) {
    return total / spendingItems.length
  } else {
    return null
  }

// =========== AVG PRINTING COSTS ============
export async function fetchAveragePrintingSpending() {
  const db = new Firestore()
  const printingSpendingItems = []

  const [repID, setRepID] = useState(null)
  useEffect(() => {
    async function getData () {
      if (representative) {
        const id = await fetchRepresentativeId(representative)
        setRepID(id)
      }
    }
    getData()
  }, [representative])

  async function fetchRepresentativeId (representative) {
    return axios
      .get(
        `http://localhost:5000/api/representatives/${representative}/getRepresentativeId`
      )
      .then(res => {
        if (res.data.success) {
          return res.data.data
        }
      })
    .catch(err => {
      console.log('Error getting documents', err)
    })
}

export function computeAveragePrintingSpending(spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  if (total >= 0 && !isNaN(total)) {
    return (total / spendingItems.length) * 3
  } else {
    return null
  }

// =========== AVG TRAVEL COSTS ============
export async function fetchAverageTravelSpending() {
  const db = new Firestore()
  const travelSpendingItems = []

  await db
    .FinancialRecord()
    .where('parent', '==', '3-Travel')
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        travelSpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return travelSpendingItems
}

export function computeAverageTravelSpending(spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  if (total >= 0 && !isNaN(total)) {
    return (total / spendingItems.length) * 7
  } else {
    return null
  }
}

// =========== MP FULL COSTS ============

// =========== MP OFFICE COSTS ============
export async function fetchOfficeSpending(repID) {
  const db = new Firestore()
  const officeSpendingItems = []

  await db
    .FinancialRecord()
    .where('member', '==', repID)
    .where('parent', '==', '8-Offices')
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        officeSpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return officeSpendingItems
}

export function computeTotalOfficeSpending(spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP TRAVEL COSTS ============
export async function fetchTravelSpending(repID) {
  const db = new Firestore()
  const travelSpendingItems = []

  await db
    .FinancialRecord()
    .where('member', '==', repID)
    .where('parent', '==', '3-Travel')
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        travelSpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return travelSpendingItems
}

export function computeTotalTravelSpending(spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP PRINTING COSTS ============
export async function fetchPrintingSpending(repID) {
  const db = new Firestore()
  const printingSpendingItems = []

  await db
    .FinancialRecord()
    .where('member', '==', repID)
    .where('parent', '==', '7-Printing')
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        printingSpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return printingSpendingItems
}

export function computeTotalPrintingSpending(spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP ADVERTISING COSTS ============
export async function fetchAdvertisingSpending(repID) {
  const db = new Firestore()
  const advertisingSpendingItems = []

  await db
    .FinancialRecord()
    .where('member', '==', repID)
    .where('category', '==', '6-Advertising')
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        advertisingSpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return advertisingSpendingItems
}

export function computeTotalAdvertisingSpending(spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP EMPLOYEE COSTS ============
export async function fetchEmployeeSpending(repID) {
  const db = new Firestore()
  const employeeSpendingItems = []

  await db
    .FinancialRecord()
    .where('member', '==', repID)
    .where('category', '==', "1-Employees' salaries")
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        employeeSpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return employeeSpendingItems
}

export function computeTotalEmployeeSpending(spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP GIFTS COSTS ============
export async function fetchGiftsSpending(repID) {
  const db = new Firestore()
  const giftsSpendingItems = []

  await db
    .FinancialRecord()
    .where('member', '==', repID)
    .where('category', '==', '5-Gifts')
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        giftsSpendingItems.push(doc.data())
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return giftsSpendingItems
}

export function computeTotalGiftsSpending(spendingItems) {
  let total = 0
  spendingItems.forEach(item => {
    total += item.amount
  })
  return total
}

// =========== MP HOSPITALITY COSTS ============

  async function getBudgetData (id) {
    return axios
      .get(
        `http://localhost:5000/api/budgets/budget/${id}`
      )
      .then(res => {
        return res.data.data
      })
    .catch(err => {
      console.log('Error getting documents', err)
    })
  }

  export async function getBudgetData(representativeID) {
  return await axios
    .get(`http://localhost:5000/api/budget/:${representativeID}`)
    .then(res => {
      return res.data.data
    })
    .catch(console.error)
}

// =========== AVERAGE FULL COSTS ============

// =========== TOTAL BUDGET COSTS ============

export default function BudgetContainer() {
  // budget data
  const [budgetData, setBudgetData] = useState([])
  useEffect(() => {
    async function getData() {
      const mp = {
        label: '',
        values: []
      }
      const avgs = {
        label: 'Average Among MPs',
        values: data.avg
      }
      /* eslint-disable */
      const user = JSON.parse(localStorage.getItem('user'))
      if (user) {
        // boilerplate data fetching
        const { email } = user
        const riding = await fetchUserRiding(email)
        const representative = await fetchRepresentative(riding)
        mp.label = representative
        const representativeId = await fetchRepresentativeId(representative)
        const { mp, avg } = await getBudgetData(representativeId)
      }
      setBudgetData([mp, avg])
    }
    getData()
  }, [budgetData])
  /* eslint-disable */
  return (
    <ListItemText>
      {budgetData.length === 0 ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <CircularProgress />
        </div>
      ) :

        <BarChartWrapper type={'budget'} data={budgetData} />

      }

      <Box m={1} />
    </ListItemText>
  )
    }
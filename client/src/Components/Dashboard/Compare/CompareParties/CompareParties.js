import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Party from './Party'
import axios from 'axios'
import Typography from '@material-ui/core/Typography'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import InfoBubble from '../../Utilities/InfoBubble'

const useStyles = makeStyles(theme => ({
  content: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  },
  customHeaders: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: '3em',
    marginLeft: '-46px'
  },
  customTooltip: {
    marginLeft: '5px',
    paddingTop: '20px'
  }
}))

export async function getAllBillsByHead (head) {
  const res = await axios.get(
    `http://localhost:5000/api/bills/${head}/getAllBillsByHead`
  )
  return res.data.data
}

export function calcPercent (percent) {
  return [percent, 100 - percent]
}

export default function CompareParties () {
  const classes = useStyles()
  const [party1, setParty1] = useState('')
  const [party2, setParty2] = useState('')

  const updateHead1 = head => {
    if (head === party1 || head === '') {
    } else {
      setParty1(head)
    }
  }

  const updateHead2 = head => {
    if (party2 === head || head === '') {
    } else {
      setParty2(head)
    }
  }

  const comparePartiesExplanationTitle = 'Compare Parties Feature'
  const comparePartiesExplanationDescription = `This is a comparison of some metrics regarding both parties. 
    The metrics are calculated based on currently elected members of this party.`

  return (
    <>
      <CssBaseline />
      <div>
        <Container maxWidth='l'>
          <Container>
            <Typography
              style={{ display: 'inline-block' }}
              className={classes.customHeaders}
              align='left'
              color='primary'
              gutterBottom
            >
              Compare Parties
            </Typography>
            <span className={classes.customTooltip}>
              <InfoBubble
                title={comparePartiesExplanationTitle}
                text={comparePartiesExplanationDescription}
              />
            </span>
          </Container>
          <div>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Party updateHead={updateHead1} />
              </Grid>
              <Grid item xs={6}>
                <Party updateHead={updateHead2} />
              </Grid>
            </Grid>
          </div>
        </Container>
      </div>
    </>
  )
}
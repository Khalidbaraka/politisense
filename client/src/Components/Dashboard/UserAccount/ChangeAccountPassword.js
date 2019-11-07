import React, { useState, useEffect } from 'react'
import { Redirect, Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import axios from 'axios'
import SaveIcon from '@material-ui/icons/Save'
import Icon from '@material-ui/core/Icon'

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    textAlign: 'center'
  },
  routerLink: {
    textDecoration: 'none',
    color: '#43D0C4'
  },
  button: {
    margin: theme.spacing(1)
  },
  form: {
    width: '80%'
  }
}))

export async function fetchUserData(userEmail) {
  let result = ''
  await axios
    .get(`http://localhost:5000/api/users/${userEmail}/getUser`)
    .then(res => {
      if (res.data.success) {
        let user = res.data.data
        result = user
      }
    })
    .catch(err => console.log(err))
  console.log(result)
  return result
}

export async function updatePassword(newPassword) {
  console.log(
    'called backend to set new password with password: ' + newPassword
  )
  //   let result = ''
  //   await axios
  //     .get(`http://localhost:5000/api/users/${userEmail}/getUser`)
  //     .then(res => {
  //       if (res.data.success) {
  //         let user = res.data.data
  //         result = user
  //       }
  //     })
  //     .catch(err => console.log(err))
  //   console.log(result)
  //   return result
}

export default function UserAccount() {
  const classes = useStyles()
  const [changeCompleted, setChangeCompleted] = useState(false)
  const [email, setEmail] = useState('')
  const [
    userEnteredPreviousPassword,
    setUserEnteredPreviousPassword
  ] = useState('')
  const [previousPasswordFromDb, setPreviousPasswordFromDb] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [validForm, setValidForm] = useState(false)
  const [user, setUser] = useState({})
  const [errors, setErrors] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    passwordConfirm: '',
    previousPassword: ''
  })

  useEffect(() => {
    async function getData() {
      let user = JSON.parse(localStorage.getItem('user'))
      let { email } = user
      let fullUserDetails = await fetchUserData(email)
      let { password } = fullUserDetails
      setPreviousPasswordFromDb(password)
    }
    getData()
  })

  function checkEmpty(obj) {
    for (var key in obj) {
      if (obj[key] !== null && obj[key] !== '') {
        return false
      }
    }
    return true
  }
  function checkForm() {
    if (firstname && lastname && email && password && passwordConfirm) {
      setValidForm(true)
    }
  }

  const handleSubmit = e => {
    e.preventDefault()

    const passwordFormat = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    let errors = {}

    let user = {
      password: password
    }

    if (userEnteredPreviousPassword !== previousPasswordFromDb) {
      errors.previousPassword = 'incorrect password'
    }

    errors.password = !user.password.match(passwordFormat)
      ? 'Invalid password format'
      : ''
    errors.passwordConfirm = !(user.password === passwordConfirm)
      ? 'Passwords do not match'
      : ''
    if (checkEmpty(errors)) {
      updatePassword(password)
      setChangeCompleted(true)
    } else {
      setErrors(errors)
    }
  }
  if (changeCompleted) {
    return <Redirect to={{ pathname: '/dashboard', state: { user: user } }} />
  }
  return (
    <div>
      <Container maxWidth='sm'>
        <Grid container spacing={3}>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid item xs={12}>
              <TextField
                margin='normal'
                onChange={e => setUserEnteredPreviousPassword(e.target.value)}
                variant='filled'
                required
                fullWidth
                name='previousPassword'
                label='Previous Password'
                type='password'
                id='previousPassword'
                error={errors.userEnteredPreviousPassword !== ''}
                helperText={errors.userEnteredPreviousPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={e => setPassword(e.target.value)}
                margin='normal'
                variant='filled'
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='current-password'
                error={errors.password !== ''}
                helperText={errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={e => setPasswordConfirm(e.target.value)}
                margin='normal'
                variant='filled'
                required
                fullWidth
                name='passwordConfirm'
                label='Confirm Password'
                type='password'
                id='passwordConfirm'
                autoComplete='current-password'
                error={errors.passwordConfirm !== ''}
                helperText={errors.passwordConfirm}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                size='large'
                className={classes.button}
              >
                <SaveIcon />
                <Box m={0.5} />
                Save New Password
              </Button>
            </Grid>
          </form>
        </Grid>
      </Container>
    </div>
  )
}

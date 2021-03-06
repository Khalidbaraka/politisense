import React, { useEffect } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import axios from 'axios'
import CenteredCircularProgress from '../../Utilities/CenteredCircularProgress'

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 200,
    maxWidth: 500
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2
  },
  noLabel: {
    marginTop: theme.spacing(3)
  }
}))

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 9 + ITEM_PADDING_TOP,
      width: 350
    }
  }
}

// Parameters: none
// Return: list of Representatives objects
async function fetchAllRepresentatives () {
  let representatives = []
  await axios
    .get('/api/representatives/getAllRepresentatives')
    .then(res => {
      if (res.data.success) {
        representatives = res.data.data
      }
    })
    .catch(err => console.error(err))
  return representatives
}

// Parameters: list of representatives objects
// Return: list of ridings
export function getAllRidings (representatives) {
  return representatives
    .map(rep => {
      return rep.riding.replace(/\u2013|\u2014/g, '-')
    })
    .sort()
}

// Parameters: email of user, new riding for that user.
// Return: none
export async function updateUserRiding (email, newRiding) {
  const updateObject = {
    email: email,
    riding: newRiding
  }
  axios.put('/api/users/updateUserRiding', updateObject)
}

function getStyles (name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  }
}

export default function RidingSwitcher (props) {
  const classes = useStyles()
  const theme = useTheme()

  const [representatives, setRepresentatives] = React.useState(null)
  useEffect(() => {
    async function getData () {
      if (!representatives) {
        const reps = await fetchAllRepresentatives()
        setRepresentatives(reps)
      }
    }
    getData()
  }, [representatives])

  const [ridings, setRidings] = React.useState(null)
  useEffect(() => {
    if (representatives && !ridings) {
      const allRidings = getAllRidings(representatives)
      setRidings(allRidings)
    }
  }, [representatives, ridings])

  const handleChange = event => {
    updateUserRiding(props.user.email, event.target.value)
      .then((resp) => {
        props.onChange(event.target.value)
      })
  }

  return (
    <div>
      {props.riding && ridings ? (
        <FormControl className={classes.formControl}>
          <Select
            value={props.riding}
            onChange={handleChange}
            input={<Input />}
            MenuProps={MenuProps}
          >
            {ridings.map(riding => (
              <MenuItem
                key={riding}
                value={riding}
                style={getStyles(riding, riding, theme)}
              >
                {riding}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (<CenteredCircularProgress />)}
    </div>
  )
}

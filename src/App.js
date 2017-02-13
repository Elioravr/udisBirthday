import React, { Component } from 'react';
import firebase from 'firebase';
import {keys, values, transform, sumBy} from 'lodash';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import './App.css';


class App extends Component {
  state = {
    isAdmin: false,
    shouldShowAdmin: false,
    isLoading: false,
    isAnswered: false,
    invited: null,
    name: '',
    quantity: ''
  }

  componentWillMount() {
    this.InvitedCollection = firebase.database().ref('udisbirthday')
    this.InvitedCollection.once("value").then(snapshot => {
      this.setState({
        invited: snapshot.val()
      })
    })
  }

  onNameChange = (e) => {
    this.setState({name: e.target.value})
    if (e.target.value === 'אריאלי המלך') {
      this.setState({isAdmin: true})
    }
  }

  onQuantityChange = (event, index, value) => {
    this.setState({quantity: value})
  }

  showAdmin = () => {
    this.setState({
      isAnswered: true,
      shouldShowAdmin: true
    })
  }

  onAnswer = (answer) => {
    if (answer === 'Udi') return

    const {name, quantity} = this.state
    if (!name || !quantity) {
      return alert('נא למלא את כל השדות!')
    }

    this.setState({isLoading: true, answer})
    this.InvitedCollection.push({name, quantity, answer}).then(() => {
      setTimeout(() => {
        this.setState({
          isLoading: false,
          isAnswered: true
        })
      }, 1000)
    })
  }

  // <img className="image image-2" src="http://icons.iconarchive.com/icons/iconsmind/outline/512/Batman-Mask-icon.png"/>
  // <img className="image image-3" src="http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons-256/magic-marker-icons-sports-hobbies/116198-magic-marker-icon-sports-hobbies-mask-sc44.png"/>
  render() {
    const {isAnswered, isLoading, name, isAdmin, shouldShowAdmin} = this.state

    if (!isAnswered) {
      return (
        <div className="App">
          <div className="title-container">
            <div className="main-title">
              <span>אודי חוגג 50</span>
              <img className="image image-1" src="http://static.wixstatic.com/media/699452_9ae652a8d47b4bfdaa03f363f13bf705.gif/v1/fill/w_16,h_16,lg_1,usm_0.66_1.00_0.01/699452_9ae652a8d47b4bfdaa03f363f13bf705.gif"/>
              <img className="image image-4" src="http://freeiconbox.com/icon/256/34849.png"/>
            </div>
            <div className="sub-title">במסיבת התחפושות של השנה</div>
          </div>
          <div className="description">
            הינך מוזמן למסיבת פורים,
            שתתקיים ביום שבת, ה-11.03.2017, בשעה 20:30, בכתובת <a target="_blank" href="waze://?ll=32.00616,34.94712">בשמת 7, שוהם</a>.
            <h3>תחפושות חובהההההה!!</h3>
            <div>נשמח אם תאשרו הגעה:</div>
          </div>
          <div className="name">
            <TextField
              ref="name"
              floatingLabelStyle={{
                transform: 'translateX(-10px)',
                color: 'black'
              }}
              onChange={this.onNameChange}
              hintText="קוראים לי..."
              hintStyle={{
                color: 'black',
                fontWeight: 'bold'
              }}
              value={name}
            />
            <SelectField
              floatingLabelText="כמה תהיו?"
              onChange={this.onQuantityChange}
              value={this.state.quantity}
              floatingLabelStyle={{
                color: 'black',
                fontWeight: 'bold'
              }}>
              <MenuItem value={1} primaryText={"בא/ה לבד! (1)"} />
              <MenuItem value={2} primaryText={"שניים זה תמיד ביחד! (2)"} />
              <MenuItem value={3} primaryText={"דברים טובים באים בשלישיות (3)"} />
            </SelectField>
          </div>
          {
            !isAdmin &&
              <div className="controls">
                <FlatButton className="button button-yes" label="ברור שאני מגיע" onClick={() => {this.onAnswer('Yes')}} />
                {<FlatButton className="button button-udi" onClick={() => {this.onAnswer('Udi')}} />}
                <FlatButton className="button button-no" label="לא אצליח להגיע" onClick={() => {this.onAnswer('No')}} />
              </div>
          }
          {
            isAdmin &&
              <div className="controls">
                <FlatButton className="button button-maybe" label="מי מגיע?!" onClick={this.showAdmin} />
              </div>
          }
          {isLoading && <div className="loading-layout"><div>חכה שניה</div><div>סופרים אותך...</div></div>}
        </div>
      )
    }
    else if (shouldShowAdmin) {
      return (
        <div className="App">
          <InvitedList invited={this.state.invited} />
        </div>
      )
    }
    else {
      return (
        <div className="App">
          {this.state.answer === 'Yes' && <img className="confirm-icon" src="/confirm.svg"/>}
          {this.state.answer === 'No' && <img className="confirm-icon" src="/unhappy.svg"/>}

          {this.state.answer === 'Yes' && <div className="confirm-text"><div>{`תודה רבה ${name}!`}</div><div>רשמנו אותך!</div></div>}
          {this.state.answer === 'No' && <div className="confirm-text"><div>{`חבל מאוד ${name}!`}</div><div>ניפגש ב-60!</div></div>}
        </div>
      )
    }
  }
}

export default App;

class InvitedList extends Component {
  generateList = () => {
    const {invited} = this.props

    return transform(values(invited), (result, value) => {
      result[value.answer] = result[value.answer] || []
      result[value.answer].push(value)
    }, {})
  }

  getTitle = (answer) => {
    switch (answer) {
      case 'Yes': {
        return 'מגיעים'
      }
      case 'Maybe': {
        return 'אולי מגיעים'
      }
      default: {
        return 'לא באים'
      }
    }
  }

  getQuantity = (answers) => {
    return sumBy(answers, 'quantity')
  }

  render () {
    const answers = this.generateList()
    return (
      <div className="invited-list">
        {keys(answers).map((key, index) => {
          return (
            <div key={index}>
              <div className="list-title">{`${this.getTitle(key)} (${this.getQuantity(answers[key])})`}</div>
              {
                answers[key].map((value, secondIndex) => {
                  return <div key={secondIndex}>{`${value.name} - ${value.quantity}`}</div>
                })
              }
            </div>
          )
        })}
      </div>
    )
  }
}

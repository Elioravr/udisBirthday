import React, { Component } from 'react';
import firebase from 'firebase';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import './App.css';


class App extends Component {
  state = {
    isLoading: false,
    isAnswered: false,
    name: '',
    quantity: ''
  }

  componentWillMount() {
    this.Invited = firebase.database().ref('udisbirthday')
  }

  onNameChange = (e) => {
    this.setState({name: e.target.value})
  }

  onQuantityChange = (event, index, value) => {
    this.setState({quantity: value})
  }

  onAgree = () => {
    const {name, quantity} = this.state
    if (!name || !quantity) {
      return alert('נא למלא את כל השדות!')
    }

    this.setState({isLoading: true})
    this.Invited.push({name, quantity, status: 'Agree'}).then(() => {
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
    const {isAnswered, isLoading, name} = this.state

    if (!isAnswered) {
      return (
        <div className="App">
          <div className="title-container">
            <div className="main-title">
              <span>מסיבת פורים</span>
              <img className="image image-1" src="http://static.wixstatic.com/media/699452_9ae652a8d47b4bfdaa03f363f13bf705.gif/v1/fill/w_16,h_16,lg_1,usm_0.66_1.00_0.01/699452_9ae652a8d47b4bfdaa03f363f13bf705.gif"/>
              <img className="image image-4" src="http://freeiconbox.com/icon/256/34849.png"/>
            </div>
            <div className="sub-title">לכבוד יום הולדתו ה-50 של אודי</div>
          </div>
          <div className="description">
            הינך מוזמן למסיבת השנה - מסיבת פורים-יום הולדת לכבוד יום הולדת ה-50 של אודי,
            שתתקיים ביום שבת, ה-11.03.2017, בשעה 20:00, בכתובת <a target="_blank" href="waze://?ll=32.00616,34.94712">בשמת 7, שוהם</a>.
            <div>נשמח אם תאשרו הגעה:</div>
          </div>
          <div className="name">
            <TextField
              ref="name"
              floatingLabelStyle={{
                transform: 'translateX(-10px)'
              }}
              onChange={this.onNameChange}
              hintText="קוראים לי..."
              value={name}
            />
            <SelectField floatingLabelText="כמה תהיו?" onChange={this.onQuantityChange} value={this.state.quantity}>
              <MenuItem value={1} primaryText={"בא/ה לבד! (1)"} />
              <MenuItem value={2} primaryText={"שניים זה תמיד ביחד! (2)"} />
              <MenuItem value={3} primaryText={"דברים טובים באים בשלישיות (3)"} />
              <MenuItem value={4} primaryText={"מביא/ה את כל החמולה (4)"} />
            </SelectField>
          </div>
          <div className="controls">
            <FlatButton className="button button-yes" label="ברור שאני מגיע" onClick={this.onAgree} />
            <FlatButton className="button button-maybe" label="לא בטוח שאגיע" />
            <FlatButton className="button button-no" label="לא אצליח אגיע" />
          </div>
          {isLoading && <div className="loading-layout"><div>חכה שניה</div><div>סופרים אותך...</div></div>}
        </div>
      )
    }
    else {
      return (
        <div className="App">
          <img className="confirm-icon" src="/confirm.svg"/>
          <div className="confirm-text"><div>{`תודה רבה ${name}!`}</div><div>רשמנו אותך!</div></div>
        </div>
      )
    }
  }
}

export default App;

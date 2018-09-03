import { connect } from 'react-redux'
import AddMessageComponent from '../components/AddMessage'
import { addMessage } from '../actions'

const mapDispatchToProps = dispatch => ({
  dispatch: (message, author) => {
    dispatch(addMessage(message, author))
  }
})

const mapStateToProps = (state) => {
  return { author: state.currentUser };
}

export const AddMessage = connect(mapStateToProps, mapDispatchToProps)(AddMessageComponent)

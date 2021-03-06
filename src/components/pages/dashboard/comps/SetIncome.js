import React from 'react'
import { connect } from 'react-redux'
import { fetchUser, createUser } from '../../../../actions'

class SetIncome extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            monthly_income: 0,
            synced: false
        }
    }

    componentDidMount() {
        this.props.fetchUser()
    }

    submitForm = (e) => {
        e.preventDefault()

        this.props.createUser({
            monthlyIncome: this.state.monthly_income
        })
    }

    static getDerivedStateFromProps (props, state) {
        if(state.synced) {
            return { ...state }
        } else {
            if(props.monthly_income !== state.monthly_income) {
                return { monthly_income: props.monthly_income, synced: true }
            }
        }
        return null
    }

    render() {

        return (
            <form onSubmit={this.submitForm}>
                <div className="row">
                    <div className="col-8 form-group">
                        <label>Income</label>
                        <input type="currency" className="form-control" value={this.state.monthly_income} onChange={(e) => this.setState({monthly_income: e.target.value})} />
                        <small className="form-text text-muted">This is on a per month basis.</small>
                    </div>
                    <div className="col-4">
                        <button type="submit" className="btn btn-primary float-right" style={{ marginTop: '32px' }}>Submit</button>
                    </div>
                </div>
            </form>
        )
    }

}

const mapStateToProps = state => {
    return { monthly_income: state.user.monthly_income === undefined ? 0 : state.user.monthly_income }
}

export default connect(mapStateToProps, { fetchUser, createUser })(SetIncome)
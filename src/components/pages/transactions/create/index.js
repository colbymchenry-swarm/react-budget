import React from 'react'
import { connect } from 'react-redux'
import { createTransaction, fetchBudgets } from '../../../../actions'

class CreateTransaction extends React.Component {

    constructor(props) {
        super(props)

        this.amountRef = React.createRef()
        this.descriptionRef = React.createRef()

        this.state = {
            selectedBudget: null,
            synced: false
        }
    }

    componentDidMount() {
        this.props.fetchBudgets()
    }

    submitForm = (e) => {
        e.preventDefault()
  
        let formValues = {
            budget_id: this.state.selectedBudget,
            amount: this.amountRef.current.value,
            description: this.descriptionRef.current.value
        }

        this.props.createTransaction(formValues)
    }

    handleChange = e => {
        let value = e.target.value;
        this.setState({
            selectedBudget: value
        });
    }

    static getDerivedStateFromProps(props, state) {
        if (!state.synced) {
            let default_budget = props.budgets.find(budget => !budget.fixed)
            // -1 for a budget id for a transaction means it is an the unknown category
            return {
                selectedBudget: default_budget === undefined ? -1 : default_budget.id,
                synced: true
            }
        } else {
            return state
        }
    }

    render() {
        if (!this.props.budgets) {
            return <div>Loading...</div>
        }

        let dropdown = this.props.budgets.map(budget => {
            if (budget.google_id === this.props.userId && !budget.fixed) {
                return (
                    <option key={budget.id} value={budget.id}>{budget.name}</option>
                )
            }
        })

        return (
            <div className="card">
                <div className="card-header">
                    New Transaction
                </div>

                <div className="card-body">
                    <form onSubmit={this.submitForm}>
                        <div className="form-group">
                            <label>Budget</label>
                            <select className="form-control" onChange={e => this.handleChange(e)}>
                                {dropdown}
                                <option key={-1} value={-1}>Unknown</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Amount</label>
                            <input type="currency" ref={this.amountRef} className="form-control" placeholder="$50.00" />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <input type="text" ref={this.descriptionRef} className="form-control" placeholder="Starbucks" />
                        </div>
                        <button type="submit" className="btn btn-primary float-right">Submit</button>
                    </form>
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return { budgets: Object.values(state.budgets), userId: state.auth.userId }
}

export default connect(mapStateToProps, { createTransaction, fetchBudgets })(CreateTransaction)
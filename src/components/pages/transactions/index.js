import React from 'react'
import { connect } from 'react-redux'
import { fetchTransactions, fetchBudget, deleteTransaction } from '../../../actions'

class ListTransactions extends React.Component {
    componentDidMount() {
        this.props.fetchBudget(this.props.match.params.id)
        this.props.fetchTransactions()
    }

    renderTransactions() {
        if (! this.props.transactions) {
            return <div>Loading...</div>
        }

        let now = new Date()

       return this.props.transactions.map(transaction => {
           if(transaction === undefined) return  undefined
            let date = new Date(transaction.timestamp)
           if (parseInt(transaction.budget_id) === parseInt(this.props.match.params.id) && now.getMonth() === date.getMonth()) {
               let budgetId = this.props.budget !== undefined ? this.props.budget.id : -1
            return (
                <tr key={transaction.id}>
                    <th scope="row"> <small className="form-text text-muted">{!transaction.description ? 'N/A' : transaction.description}</small></th>
                    <td>${transaction.amount}</td>
                    <td>{date.getDate()}</td>
                    <td onClick={e => this.props.deleteTransaction(transaction.id, budgetId)}><i className="fas fa-trash" style={{ color: 'red' }}></i></td>
                </tr>
            )
           } else return undefined
       })
    }

    render() {
        let now = new Date()
        let month = now.toLocaleString('default', { month: 'long' })
        return (
            <React.Fragment>
                <h1>{this.props.budget !== undefined ? this.props.budget.name : "Fun Money"}</h1>
                <h4>{month}, {now.getFullYear()}</h4>
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th className="col-7">Description</th>
                            <th className="col-3">Amt</th>
                            <th className="col-1">Day</th>
                            <th className="col-1"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTransactions()}
                    </tbody>
                </table>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return { 
        transactions: Object.values(state.transactions),
        budget: state.budgets[ownProps.match.params.id] 
    }
}

export default connect(mapStateToProps, { fetchBudget, fetchTransactions, deleteTransaction })(ListTransactions)


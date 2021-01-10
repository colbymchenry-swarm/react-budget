import React from 'react'
import { connect } from 'react-redux'
import { fetchBudgets, fetchTransactions, fetchIncomes } from '../../../../actions'
import SetIncome from './SetIncome'
import { Link } from 'react-router-dom'

class Overview extends React.Component {

    state = {
        monthly_income: -1
    }

    componentDidMount() {
        this.props.fetchBudgets()
        this.props.fetchTransactions()
        this.props.fetchIncomes()
    }

    getIncome() {
        let totalIncome = 0
        let now = new Date()

        this.props.incomes.forEach(income => {
            let date = new Date(income.timestamp)

            if (date.getMonth() === now.getMonth()) {
                totalIncome += parseInt(income.amount)
            }
        })

        return totalIncome
    }

    spendingData() {
        let totalSpending = 0
        let totalBudget = 0
        let now = new Date()

        this.props.transactions.forEach(transaction => {
            let date = new Date(transaction.timestamp)

            if (date.getMonth() === now.getMonth() && parseInt(transaction.budget_id) !== -1) {
                totalSpending += parseInt(transaction.amount)
            }
        })

        this.props.budgets.forEach(budget => {
            if (budget.id !== undefined && !budget.fixed) {
                totalBudget += parseInt(budget.amount)
            }
        })

        let percentage = totalSpending / totalBudget
        percentage = percentage === Infinity ? 0 : percentage * 100


        return { totalSpending, totalBudget, percentage }
    }

    funMoneyData() {
        let now = new Date()

        let funMoneySpent = 0
        // total fun money spent
        this.props.transactions.forEach(transaction => {
            let date = new Date(transaction.timestamp)
            if (date.getMonth() === now.getMonth() && parseInt(transaction.budget_id) === -1) {
                funMoneySpent += parseInt(transaction.amount)
            }
        })


        let totalBudget = 0
        // add up fixed budget amounts
        this.props.budgets.forEach(budget => {
            if (budget.id !== undefined && parseInt(budget.google_id) === parseInt(this.props.userId)) {
                totalBudget += parseInt(budget.amount)
            }
        })

        let funMoneyAllowance = (this.state.monthly_income + this.getIncome()) - totalBudget

        let percentage = funMoneySpent / funMoneyAllowance
        percentage = percentage === Infinity ? 0 : percentage * 100

        return { percentage, funMoneyAllowance, funMoneySpent }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.monthly_income === -1 || prevProps.monthly_income !== this.props.monthly_income) 
            this.setState({monthly_income: this.props.monthly_income })
    }

    daysInThisMonth() {
        var now = new Date();
        return new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
    }

    render() {
        let now = new Date()
        let todayPercentage = (now.getDate() / this.daysInThisMonth()) * 100
        let { totalSpending, totalBudget, percentage } = this.spendingData()
        let funMondayData = this.funMoneyData()


        return (
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-6">
                            <p style={{ marginTop: '4px', height: '8px' }}>Overview</p>
                        </div>
                        <div className="col-6">
                            <Link to="/income" className="btn btn-primary btn-sm float-right">Manage Income</Link>
                        </div>
                    </div>
                </div>

                <div className="card-body">

                    <SetIncome />

                    <div className="row">
                        <div className="col-6">
                            Additional Income:
                        </div>
                        <div className="col-6">
                            <p className="float-right">${this.getIncome()}</p>
                        </div>
                    </div>

                    <table className="table">
                        <tbody>
                            <tr>
                                <th className="col-10" scope="row">
                                    <span style={{ height: '8px' }}>Budget Spending</span>
                                    <br />
                                    <div className="progress">
                                        <div className="progress-bar" role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100" style={{ width: `${percentage}%` }}></div>
                                        <div style={{ width: '2px', height: '20px', position: 'absolute', background: 'black', left: `${todayPercentage}%`, top: '-2px' }}></div>
                                    </div>
                                </th>
                                <td className="col-2">
                                    ${totalSpending}
                                    <br />
                                    <small className="form-text text-muted">${totalBudget}</small>
                                </td>
                            </tr>

                            <tr>
                                <th className="col-10" scope="row">
                                    <span style={{ height: '8px' }}><Link to={`/transactions/view/-1`}>Fun Money</Link> Spending</span>
                                    <br />
                                    <div className="progress">
                                        <div className="progress-bar" role="progressbar" aria-valuenow={funMondayData.percentage} aria-valuemin="0" aria-valuemax="100" style={{ width: `${funMondayData.percentage}%` }}></div>
                                        <div style={{ width: '2px', height: '20px', position: 'absolute', background: 'black', left: `${todayPercentage}%`, top: '-2px' }}></div>
                                    </div>
                                </th>
                                <td className="col-2">
                                    ${funMondayData.funMoneySpent}
                                    <br />
                                    <small className="form-text text-muted">${funMondayData.funMoneyAllowance}</small>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { 
        budgets: Object.values(state.budgets), 
        transactions: Object.values(state.transactions),
        userId: state.auth.userId,
        monthly_income: state.user.monthly_income,
        incomes: Object.values(state.incomes)
    }
}

export default connect(mapStateToProps, { fetchBudgets, fetchTransactions, fetchIncomes })(Overview)


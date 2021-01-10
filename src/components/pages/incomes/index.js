import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchIncomes, deleteIncome } from '../../../actions'

class Income extends React.Component {
    componentDidMount() {
        this.props.fetchIncomes()
    }

    renderIncomes() {
        if (! this.props.incomes) {
            return <div>Loading...</div>
        }

        let now = new Date()

       return this.props.incomes.map(income => {
        let date = new Date(income.timestamp)
        if (income === undefined) return undefined
            if(date.getMonth() === now.getMonth()) {
                return (
                    <tr key={income.id}>
                        <th scope="row"> <small className="form-text text-muted">{!income.description ? 'N/A' : income.description}</small></th>
                        <td>${income.amount}</td>
                        <td>{date.getDate()}</td>
                        <td onClick={e => this.props.deleteIncome(income.id)}><i className="fas fa-trash" style={{ color: 'red' }}></i></td>
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
                <div className="row">
                    <div className="col-10">
                        <h1>Income</h1>
                        <h4>{month}, {now.getFullYear()}</h4>
                    </div>
                    <div className="col-2">
                        <Link to="/income/create" className="btn btn-primary float-right" style={{ marginTop: '32px' }}>New</Link>
                    </div>
                </div>
                
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
                        {this.renderIncomes()}
                    </tbody>
                </table>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return { 
        incomes: Object.values(state.incomes),
    }
}

export default connect(mapStateToProps, { fetchIncomes, deleteIncome })(Income)


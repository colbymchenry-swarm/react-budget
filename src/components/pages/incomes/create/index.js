import React from 'react'
import { connect } from 'react-redux'
import { createIncome } from '../../../../actions'

class CreateIncome extends React.Component {

    constructor(props) {
        super(props)

        this.amountRef = React.createRef()
        this.descriptionRef = React.createRef()

    }

    submitForm = (e) => {
        e.preventDefault()
  
        let formValues = {
            amount: this.amountRef.current.value,
            description: this.descriptionRef.current.value
        }

        this.props.createIncome(formValues)
    }

    render() {
        return (
            <div className="card">
                <div className="card-header">
                    New Income
                </div>

                <div className="card-body">
                    <form onSubmit={this.submitForm}>
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

export default connect(null, { createIncome })(CreateIncome)
import { combineReducers } from 'redux'
import authReducer from './authReducer'
import budgetsReducer from './budgetsReducer'
import transactionsReducer from './transactionsReducer'
import usersReducer from './usersReducer'
import incomesReducer from './incomesReducer'

export default combineReducers({
    auth: authReducer,
    budgets: budgetsReducer,
    transactions: transactionsReducer,
    user: usersReducer,
    incomes: incomesReducer
})
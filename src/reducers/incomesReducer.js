import _ from 'lodash'
import { 
    CREATE_INCOME,
    DELETE_INCOME,
    FETCH_INCOMES
 } from '../actions/types'

const handler = (state = {}, action) => {
    switch (action.type) {
        case CREATE_INCOME:
            return { ...state, [action.payload.id]: action.payload }
        case FETCH_INCOMES:
            return { ...state, ..._.mapKeys(action.payload, 'id') }
        case DELETE_INCOME:
            return _.omit(state, action.payload)
        default: return state
    }
}

export default handler
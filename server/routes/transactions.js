var express = require('express');
var router = express.Router();

/* GET transactions for user google_id */
router.get('/list', async (req, res, next) => {
	const budgets = await getTransactions(res.locals.connection, req.query.google_id)
	res.send(JSON.stringify(budgets))
})

/* CREATE transaction */
router.post('/', async (req, res, next) => {

	try {
		await createTransaction(res.locals.connection, req.body)
	} catch(err) {
		console.log(err)
		res.send(JSON.stringify({ success: false, msg: 'Failed to record transaction.' }))
	}

	res.send(JSON.stringify({ success: true, msg: 'Transaction recorded successfully.' }))
})

/* DELETE budget */
router.post('/delete', async (req, res, next) => {
	try {
		await deleteTransaction(res.locals.connection, req.body.id)
	} catch(err) {
		console.log(err)
		res.send(JSON.stringify({ success: false, msg: 'Failed to delete transaction.' }))
	}

	res.send(JSON.stringify({ success: true, msg: 'Transaction deleted successfully.' }))
})

/** ---------- FUNCTIONS --------- */
getTransactions = async (db, google_id) => {
	return await db.query(`SELECT * FROM transactions WHERE google_id='${google_id}'`)
}

createTransaction = async (db, { budget_id, amount, description, google_id  }) => {
	let timestamp = (new Date()).toISOString().split('T')[0]
	await db.query(`INSERT INTO transactions (budget_id, amount, timestamp, description, google_id) VALUES ('${budget_id}', '${amount}', '${timestamp}', '${description}', '${google_id}')`) 
}

deleteTransaction = async (db, id) => {
	await db.query(`DELETE FROM transactions WHERE id='${id}'`) 
}


module.exports = router;
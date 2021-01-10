var express = require('express');
var router = express.Router();

/* GET transactions for user google_id */
router.get('/list', async (req, res, next) => {
	const incomes = await getIncomes(res.locals.connection, req.query.google_id)
	res.send(JSON.stringify(incomes))
})

/* CREATE transaction */
router.post('/', async (req, res, next) => {

	try {
		await createIncome(res.locals.connection, req.body)
	} catch(err) {
		console.log(err)
		res.send(JSON.stringify({ success: false, msg: 'Failed to record transaction.' }))
	}

	res.send(JSON.stringify({ success: true, msg: 'Transaction recorded successfully.' }))
})

/* DELETE budget */
router.post('/delete', async (req, res, next) => {
	try {
		await deleteIncome(res.locals.connection, req.body.id)
	} catch(err) {
		console.log(err)
		res.send(JSON.stringify({ success: false, msg: 'Failed to delete income.' }))
	}

	res.send(JSON.stringify({ success: true, msg: 'Income deleted successfully.' }))
})

/** ---------- FUNCTIONS --------- */
getIncomes = async (db, google_id) => {
	return await db.query(`SELECT * FROM incomes WHERE google_id='${google_id}'`)
}

createIncome = async (db, { amount, description, google_id  }) => {
	let timestamp = (new Date()).toISOString().split('T')[0]
	await db.query(`INSERT INTO incomes (amount, timestamp, description, google_id) VALUES ('${amount}', '${timestamp}', '${description}', '${google_id}')`) 
}

deleteIncome = async (db, id) => {
	await db.query(`DELETE FROM incomes WHERE id='${id}'`) 
}


module.exports = router;

const methods = {
	create: async (model, data, additional = undefined) => {
		return model.create(data, additional || undefined)
	},
	update: async (model, query, data, additional = undefined) => {
		return model.update(data, query, additional || undefined)
	},
	delete: async (model, query, additional = undefined) => {
		return model.destroy(query, additional || undefined)
	},
	get: async (model, query, additional = undefined) => {
		return model.findOne(query, additional || undefined)
	},
	checkFlag: async (model, query) => {
		return model.count(query)
	},
	getAll: async (model, query, limit = 10, offset = 0) => {
		return model.findAll({ ...query, limit, offset })
	},
	rawQuery: async (model, query, options) => {
		return model.findAll(query, options)
	},
	getById: async (model, id) => {
		return model.findByPk(id)
	},
	getAndCountAll: async (model, query, limit, offset) => {
		return model.findAndCountAll({ ...query, limit, offset })
	},
	bulkCreate: async (model, data, additional = undefined) => {
		return model.bulkCreate(data, additional || undefined)
	},
	
}


module.exports = { methods }
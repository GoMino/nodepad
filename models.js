function defineModels(mongoose, fn) {

	var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

	/*
     * Model: Document
     */
	Document = new Schema({
		'title': {
			type: String,
			index: true
		},
		'data': String,
		'tags': [String],
		'user_id': ObjectId

	});

	Document.virtual('id').get(function() {
		return this._id.toHexString();
	});

	//Here we register the schema for model "Document"
	mongoose.model('Document', Document);

	fn();
};

exports.defineModels = defineModels;


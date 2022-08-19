const { model, Schema } = require('mongoose')

const UrlSchema = new Schema(
  {
    id: {
      required: true,
      type: String,
      unique: true
    },
    link: {
      required: true,
      type: String
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users'
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toObject: {
      transform: (_, ret) => {
        delete ret._id
      }
    }
  }
)

const UrlModel = model('urls', UrlSchema)

module.exports = UrlModel

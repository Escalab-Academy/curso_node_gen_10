const { model, Schema } = require('mongoose')
const {
  role: { ROLE_NAMES }
} = require('../../../utils')

const RoleSchema = new Schema(
  {
    id: {
      required: true,
      type: String,
      unique: true
    },
    name: {
      required: true,
      type: String,
      enum: ROLE_NAMES
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

const RoleModel = model('roles', RoleSchema)

module.exports = RoleModel

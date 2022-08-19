const { model, Schema } = require('mongoose')

const UserSchema = new Schema(
  {
    id: {
      required: true,
      type: String,
      unique: true
    },
    name: {
      required: true,
      type: String
    },
    lastName: {
      required: true,
      type: String
    },
    email: {
      required: true,
      type: String
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toObject: {
      transform: (_, ret) => {
        delete ret._id
      }
    },
    virtuals: {
      fullName: {
        get() {
          return `${this.name} ${this.lastName}`
        }
      }
    }
  }
)

const UserModel = model('users', UserSchema)

module.exports = UserModel

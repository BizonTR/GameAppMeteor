import SimpleSchema from 'meteor/aldeed:simple-schema'

SimpleSchema.defineValidationErrorTransform((error) => {
  const ddpError = new Meteor.Error('schema-error', error.message, false)
  ddpError.details = error.details
  return ddpError
})
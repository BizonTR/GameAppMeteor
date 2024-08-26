// import { Mongo } from 'meteor/mongo';
// import SimpleSchema from 'meteor/aldeed:simple-schema'

// export const Games = new Mongo.Collection('games');

// const UserProfileSchema = new SimpleSchema({
//   avatarUrl: {
//     type: String,
//     optional: true, // Kullanıcı bir avatar URL'si eklemek zorunda değil
//   },
//   bio: {
//     type: String,
//     optional: true, // Kullanıcı bir biyografi eklemek zorunda değil
//   },
//   location: {
//     type: String,
//     optional: true, // Kullanıcı bir konum eklemek zorunda değil
//   },
// });

// const UserSchema = new SimpleSchema({
//   username: {
//     type: String,
//     min: 3, // Kullanıcı adı en az 3 karakter olmalı
//   },
//   email: {
//     type: String,
//     regEx: SimpleSchema.RegEx.Email, // Geçerli bir e-posta adresi olmalı
//   },
//   passwordHash: {
//     type: String, // Hashlenmiş şifre zorunlu
//   },
//   createdAt: {
//     type: Date,
//     optional: true, // Otomatik olarak oluşturulabilir, bu yüzden isteğe bağlı
//   },
//   profile: {
//     type: UserProfileSchema, // Profil bilgileri alt şemadan
//     optional: true, // Profil alanları isteğe bağlı
//   },
//   friends: {
//     type: Array,
//     optional: true, // Kullanıcı başlangıçta arkadaş listesi olmadan kaydedilebilir
//   },
//   'friends.$': {
//     type: String, // Her arkadaş bir kullanıcı kimliğini (ID) temsil eder
//   },
//   reviews: {
//     type: Array,
//     optional: true, // Kullanıcı başlangıçta yorum yapmamış olabilir
//   },
//   'reviews.$': {
//     type: Object, // Her yorum bir nesne olarak temsil edilir
//   },
//   'reviews.$.reviewId': {
//     type: String,
//   },
//   'reviews.$.content': {
//     type: String,
//   },
// });

// export default UserSchema;

import { Migrations } from 'meteor/percolate:migrations';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

Migrations.add({
  version: 3, // Migration sürüm numarası
  name: 'Create admin and test user with roles',
  up() {
    // Rolleri kontrol et ve oluştur
    const roles = ['admin', 'user'];
    roles.forEach((role) => {
      if (!Roles.getAllRoles().fetch().some(r => r.name === role)) {
        Roles.createRole(role, { unlessExists: true });
        console.log(`Role "${role}" created.`);
      } else {
        console.log(`Role "${role}" already exists.`);
      }
    });

    // Admin kullanıcı oluşturma ve rol atama
    const adminEmail = 'admin@example.com';
    const adminPassword = 'securepassword'; // Admin için güvenli bir şifre belirleyin

    let adminId;
    const existingAdmin = Accounts.findUserByEmail(adminEmail);
    if (!existingAdmin) {
      adminId = Accounts.createUser({
        email: adminEmail,
        password: adminPassword
      });
      console.log('Admin user created successfully.');
    } else {
      adminId = existingAdmin._id;
      console.log('Admin user already exists.');
    }

    if (!Roles.userIsInRole(adminId, 'admin')) {
      Roles.addUsersToRoles(adminId, 'admin');
      console.log('Admin role assigned to the user.');
    } else {
      console.log('Admin user already has the admin role.');
    }

    // Deneme kullanıcı oluşturma ve rol atama
    const testEmail = 'deneme@example.com';
    const testPassword = 'testpassword'; // Deneme kullanıcı için bir şifre belirleyin

    let testUserId;
    const existingTestUser = Accounts.findUserByEmail(testEmail);
    if (!existingTestUser) {
      testUserId = Accounts.createUser({
        email: testEmail,
        password: testPassword
      });
      console.log('Test user created successfully.');
    } else {
      testUserId = existingTestUser._id;
      console.log('Test user already exists.');
    }

    if (!Roles.userIsInRole(testUserId, 'user')) {
      Roles.addUsersToRoles(testUserId, 'user');
      console.log('User role assigned to the test user.');
    } else {
      console.log('Test user already has the user role.');
    }
  },
  down() {
    console.log('No down migration implemented since roles and users are essential.');
  }
});

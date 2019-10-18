const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.createUser = functions.auth.user().onCreate((user) => {
  const SIZE = 100;
  const batch = db.batch();
  for (let i = 0; i < SIZE; i++) {
    batch.set(
      db.collection('/posts').doc(),
      {
        author: user.uid,
        text: 'test',
        order: i
      }
    );
  }
  batch.set(
    db.collection('/users').doc(user.uid),
    {
      email: user.email,
      postsSize: SIZE
    }
  );
  batch.commit();
});

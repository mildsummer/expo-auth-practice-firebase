const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

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

exports.verifyEmail = functions.https.onCall((data) => {
  return auth.getUserByEmail(data.email).then((user) => {
    return db.collection('/users')
      .doc(user.uid)
      .update({ emailVerifiedAt: admin.firestore.Timestamp.fromDate(new Date()) })
      .then(() => {
        return { message: 'success' };
      }).catch(({ message }) => {
        throw new functions.https.HttpsError(message);
      });
  });
});

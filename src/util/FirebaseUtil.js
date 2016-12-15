import * as firebase from 'firebase';

class FirebaseUtil {
  static signIn() {
    return new Promise((resolve, reject) => {
      firebase.auth().signInAnonymously()
        .then(() => {
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  static signOut() {
    return new Promise((resolve, reject) => {
      firebase.auth().signOut()
        .then(() => {
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  static exists(refString) {
    const group = firebase.database().ref(refString);

    return new Promise((resolve, reject) => {
      group.once('value', data => {
        if(data.val() == null) {
          reject();
        }
        else {
          resolve();
        }
      });
    }); 
  }

  static push(refString, data) {
    return new Promise((resolve, reject) => {
      firebase.database().ref(refString).push(data)
        .then(() => resolve())
        .catch(err => reject());
    });
  }

  static set(refString, data) {
    return new Promise((resolve, reject) => {
      firebase.database().ref(refString).set(data)
        .then(() => resolve())
        .catch(err => reject());
    });
  }

  static delete(refString) {
    return new Promise((resolve, reject) => {
      firebase.database().ref(refString).remove()
        .then(() => resolve())
        .catch(err => reject());
    });
  }

  static transaction(refString, func) {
    return new Promise((resolve, reject) => {
      firebase.database().ref(refString).transaction(func)
        .then(() => resolve())
        .catch(err => reject());
    });
  }

  static once(refString, event, func) {
    firebase.database().ref(refString).once(event, func);
  }

  static on(refString, event, func) {
    firebase.database().ref(refString).on(event, func);
  }
}

export default FirebaseUtil;
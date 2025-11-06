import firebase_app from "../config"
import firebaseConfig from "../config"
import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, signInWithPopup } from "firebase/auth"

const auth = getAuth(firebase_app)

export default async function googleAuth() {
  const provider = new GoogleAuthProvider()

  try {
    await signInWithPopup(auth, provider)
  } catch (e) {
    console.error("Error initiating redirect:", e)
  }
}

export async function handleGoogleRedirect() {
  let result = null
  let error = null
  let user = null

  try {
    result = await getRedirectResult(auth)
    if (result) {
      user = result.user
    }
  } catch (e) {
    error = e
  }

  console.log("Google Redirect Result:", result)
  return { result, error, user }
}

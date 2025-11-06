import firebase_app from "../config"
import { signOut, getAuth } from "firebase/auth"

// Get the authentication instance using the Firebase app
const auth = getAuth(firebase_app)

// Function to sign out the current user
export default async function logout() {
  let result = null,
    error = null

  try {
    result = await signOut(auth)
  } catch (e) {
    error = e
  }

  return { result, error }
}

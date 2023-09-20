import { SerializedError } from "@reduxjs/toolkit"
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query"

export const formatFetchError = (error: FetchBaseQueryError | SerializedError | undefined) => {
  if (error) {
    if ('status' in error) {
      // you can access all properties of `FetchBaseQueryError` here
      const errMsg = error.data && typeof error.data === 'object' && 'message' in error.data  ? 
        String(error.data.message) : JSON.stringify(error)

      return errMsg
    } else {
        // you can access all properties of `SerializedError` here
        return error.message
    }
  }
  return null
}
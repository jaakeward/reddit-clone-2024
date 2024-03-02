export const FIREBASE_ERRORS = {
    "Firebase: Error (auth/email-already-in-use).":
        "A user with that email already exists.",
    "Firebase: Error (auth/user-not-found).":
        "Invalid email or password.",
    "Firebase: Error (auth/wrong-password).":
        "Invalid email or password.",
    "Firebase: Error (auth/invalid-email).":
        "The email address is not valid.",
    "Firebase: Errror (auth/missing-android-pkg-name).":
        "Missing Android package name",
    "Firebase: Error (auth/missing-continue-uri).":
        "A URL was not provided in the request.",
    "Firebase: Error (auth/missing-ios-bundle-id).":
        "An iOS Bundle ID was not provided.",
    "Firebase: Error (auth/invalid-continue-uri).":
        "The continue URL provided in the request is invalid.",
    "Firebase: Error (auth/unauthorized-continue-uri).":
        "The domain of the continue URL is invalid.",
    "Firebase: Error (storage/unknown).":
        "An unknown error occurred.",
    "Firebase: Error (storage/object-not-found).":
        "No object exists at the desired reference.",
    "Firebase: Error (storage/bucket-not-found).":
        "No bucket is configured for Cloud Storage.",
    "Firebase: Error (storage/project-not-found":
        "No project is configured for Cloud Storage.",
    "Firebase: Error (storage/quota-exceeded).":
        "Quota on your Cloud Storage bucket has been exceeded.If you're on the no-cost tier, upgrade to a paid plan. If you're on a paid plan, reach out to Firebase support.",
    "Firebase: Error (storage/unauthenticated).":
        "User is unauthenticated, please authenticate and try again.",
    "Firebase: Error (storage/unauthorized).":
        "User is not authorized to perform the desired action, check your security rules to ensure they are correct.",
    "Firebase: Error (storage/retry-limit-exceeded).":
        "The maximum time limit on an operation(upload, download, delete, etc.) has been excceded.Try uploading again.",
    "Firebase: Error (storage/invalid-checksum).":
        "File on the client does not match the checksum of the file received by the server.Try uploading again.",
    "Firebase: Error (storage/canceled).":
        "User canceled the operation.",
    "Firebase: Error (storage/invalid-event-name).":
        "Invalid event name provided. Must be one of[`running`, `progress`, `pause`]",
    "Firebase: Error (storage/invalid-url).":
        "Invalid URL provided to refFromURL().Must be of the form: gs://bucket/object or https://firebasestorage.googleapis.com/v0/b/bucket/o/object?token=<TOKEN>",
    "Firebase: Error (storage/invalid-argument).":
        "The argument passed to put() must be`File`, `Blob`, or`UInt8` Array.The argument passed to putString() must be a raw, `Base64`, or`Base64URL` string.",
    "Firebase: Error (storage/no-default-bucket).":
        "No bucket has been set in your config's storageBucket property.",
    "Firebase: Error (storage/cannot-slice-blob.":
        "Commonly occurs when the local file has changed(deleted, saved again, etc.).Try uploading again after verifying that the file hasn't changed.",
    "Firebase: Error (storage/server-file-wrong-size).":
        "File on the client does not match the size of the file received by the server.Try uploading again."
}
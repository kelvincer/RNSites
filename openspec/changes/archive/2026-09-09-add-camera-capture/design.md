## Context

The SiteScreen form (`src/presentation/screens/SiteScreen.tsx`) currently uses `launchImageLibrary` from `react-native-image-picker` v8.2.1 to let users pick an image from the gallery. The same library provides `launchCamera` which supports device camera capture. The form already has an actions row with a gallery button and a location button. The `imageUri` field on the `Place` entity is already nullable and supports any valid URI.

## Goals / Non-Goals

**Goals:**
- Add a camera button that opens the device camera via `launchCamera`
- Follow the exact same callback and storage pattern as the existing gallery flow
- Rely on `react-native-image-picker`'s internal permission handling (no CAMERA permission in the manifest)
- Support Android only (iOS is explicitly out of scope for now)

**Non-Goals:**
- iOS camera support (no Info.plist changes)
- Custom camera UI or overlay
- Image editing, cropping, or filtering after capture
- Using `react-native-permissions` for explicit permission management (the library handles runtime prompts internally)
- Persisting images to a permanent app directory (existing temporary URI approach is preserved)

## Decisions

### 1. Use `launchCamera` from the existing `react-native-image-picker` library

**Rationale:** The library is already installed (v8.2.1), already imported in SiteScreen.tsx, and `launchCamera` shares the same API surface as `launchImageLibrary`. No new dependency needed.

**Alternatives considered:**
- `react-native-camera` — deprecated, heavier, adds native module complexity
- `expo-camera` — would require Expo migration, overkill for this use case

### 2. Dedicated camera button (not a choice dialog)

**Rationale:** Two separate icons (camera + gallery) in the actions row is simpler to implement, more discoverable, and consistent with the existing UI pattern of one icon per action. A dialog/sheet would require additional state management and UI components.

**Alternatives considered:**
- Bottom sheet or alert dialog choosing between camera and gallery — more UI work, less direct

### 3. Mirror the existing `selectImage` callback pattern

**Rationale:** The `takePhoto` function will be structurally identical to `selectImage` (lines 102-126 of SiteScreen.tsx), just calling `launchCamera` instead of `launchImageLibrary`. Same response handling and same `setFieldValue` call. The options differ: `CameraOptions` has no `selectionLimit` (that property exists only on `ImageLibraryOptions`), so `takePhoto` uses only `mediaType: 'photo'` and `quality: 1`.

### 4. Let `launchCamera` handle permission requests internally — do NOT declare CAMERA in the manifest

**Rationale:** `react-native-image-picker` requests camera permission at runtime itself and explicitly states it does not require `Manifest.permission.CAMERA` to be declared. If the permission IS declared in `AndroidManifest.xml`, Android requires the app to request it at runtime; since the library handles this internally instead, it throws the error: *"This library does not require Manifest.permission.CAMERA, if you add this permission in manifest then you have to obtain the same."* Therefore the manifest must remain unchanged.

**Alternatives considered:**
- Declaring `CAMERA` and using `react-native-permissions` to request it explicitly — rejected: conflicts with the library's internal handling and adds unnecessary complexity

## Risks / Trade-offs

- **Stale native build** — The library's runtime check inspects the APK's merged manifest. If the app was previously built while `CAMERA` was declared, the installed APK keeps the permission until a clean native rebuild and reinstall (`gradlew clean` + rebuild). An incremental JS reload is NOT enough.
- **Windows native build file locks** — A running emulator holding the old `libreactnative.so` can fail the CMake step with a file-lock error; stop the emulator (or retry) before rebuilding.
- **Simulator behavior** — `launchCamera` will fail on Android emulators without a camera pass-through. This is expected and acceptable for development. The existing error callback logs the failure.
- **Temporary URI persistence** — Camera-captured images use temporary file URIs that may not survive app reinstalls or cache clears. This is the same limitation the gallery flow already has; fixing it is out of scope.
- **No manual permission pre-check** — If the user denies camera permission, `launchCamera` returns an error and the user sees no image. A future enhancement could show an explanatory dialog, but that is out of scope for this change.

## 1. Android Permissions

- [x] 1.1 Confirm the `CAMERA` permission is NOT declared in `android/app/src/main/AndroidManifest.xml` and NOT present in the merged manifest at `android/app/build/intermediates/merged_manifests/debug/.../AndroidManifest.xml` (the library checks the installed APK's merged manifest at runtime; a stale build that still bundles `CAMERA` triggers the error, so a `gradlew clean` rebuild and reinstall is required after removing it)

## 2. Camera Functionality

- [x] 2.1 Import `launchCamera` from `react-native-image-picker` in `src/presentation/screens/SiteScreen.tsx` alongside the existing `launchImageLibrary` import
- [x] 2.2 Create a `takePhoto` function inside the Formik render that calls `launchCamera` with `CameraOptions` (`mediaType: 'photo'`, `quality: 1` — `selectionLimit` is only valid for the gallery picker, not the camera) and stores the result via `setFieldValue('imageUri', ...)`, verifying the callback handles cancel, error, and success cases

## 3. UI Integration

- [x] 3.1 Add a camera `IconButton` with icon `"camera"` in the actions row (line ~257 area of SiteScreen.tsx), positioned before or alongside the existing gallery button, and verify it calls `takePhoto` on press

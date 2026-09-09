## Why

The SiteScreen form currently only allows users to pick an image from the device gallery. Users need the ability to take a photo directly with the camera when registering or editing a place, which is a more natural UX for capturing a location on-site.

## What Changes

- Add a dedicated camera button to the SiteScreen actions row, alongside the existing gallery button
- Implement a `takePhoto` function using `launchCamera` from the already-installed `react-native-image-picker` library
- Let `react-native-image-picker` handle camera permission requests internally (no manifest changes required)
- The camera button uses the same callback pattern as the existing gallery flow, storing the resulting URI in the form's `imageUri` field

## Capabilities

### New Capabilities

- `camera-capture`: Allows users to capture a photo using the device camera when creating or editing a place, storing the resulting image URI in the place record

### Modified Capabilities

<!-- No existing specs to modify -->

## Impact

- **Code**: `src/presentation/screens/SiteScreen.tsx` (new import, new function, new button)
- **Permissions**: None — `react-native-image-picker` handles the camera permission request internally; declaring `CAMERA` in the manifest would cause a runtime error
- **Dependencies**: None added — `react-native-image-picker` v8.2.1 is already installed and supports `launchCamera`
- **Breaking changes**: None

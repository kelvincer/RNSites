## Purpose

Lets users capture a photo using the device camera when creating or editing a place, storing the resulting image URI in the place record.

## ADDED Requirements

### Requirement: Camera capture button
The system SHALL display a dedicated camera button in the SiteScreen actions row, visually distinct from the existing gallery button.

#### Scenario: Camera button is visible
- **WHEN** the user opens the SiteScreen form (new place or edit place)
- **THEN** a camera icon button is displayed in the actions row alongside the existing gallery and location buttons

### Requirement: Launch device camera
The system SHALL open the device camera when the user taps the camera button, using `launchCamera` from `react-native-image-picker`.

#### Scenario: Successful photo capture
- **WHEN** the user taps the camera button and successfully takes a photo
- **THEN** the captured image URI is stored in the form's `imageUri` field and the image preview updates to show the new photo

#### Scenario: User cancels camera
- **WHEN** the user taps the camera button and cancels without taking a photo
- **THEN** the form state remains unchanged and no image is set

#### Scenario: Camera fails
- **WHEN** the user taps the camera button and the camera operation returns an error
- **THEN** the form state remains unchanged and the error is logged

### Requirement: Camera permission handling
The system SHALL NOT declare the `CAMERA` permission in the Android manifest. The `react-native-image-picker` library handles the runtime camera permission request internally; declaring the permission in the manifest without requesting it at runtime causes the library to throw an error.

#### Scenario: First-time camera use on Android
- **WHEN** the user taps the camera button for the first time and has not previously granted camera permission
- **THEN** the Android OS displays a runtime permission dialog requesting camera access

#### Scenario: Camera permission already granted
- **WHEN** the user taps the camera button and camera permission is already granted
- **THEN** the camera opens directly without prompting

#### Scenario: CAMERA permission declared in manifest
- **WHEN** the `CAMERA` permission is declared in the Android manifest
- **THEN** the library refuses to launch the camera and warns that the app must request the permission itself

### Requirement: Image preview integration
The system SHALL display the camera-captured image in the same preview area used by gallery-selected images.

#### Scenario: Preview after capture
- **WHEN** a photo is captured via camera
- **THEN** the image preview area displays the captured photo at full width, replacing any placeholder text

### Requirement: Camera-captured images persist with place
The system SHALL store the camera-captured image URI in the place record using the same `imageUri` field as gallery-selected images.

#### Scenario: Save place with camera image
- **WHEN** the user captures a photo via camera and saves the place
- **THEN** the place record contains the camera image URI in its `imageUri` field

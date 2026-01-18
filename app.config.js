export default ({ config }) => ({
  ...config,
  name: "Your Future",
  slug: "yourfuture",
  version: "1.0.0",

  plugins: [
    "./app.plugin.cjs",
    "expo-font"
  ],

  icon: "./assets/icons/icon.png", // generiek app icon

  ios: {
    ...config.ios,
    bundleIdentifier: "casper.yourfuture.V1",
    buildNumber: "1",
    supportsTablet: true,
    icon: "./assets/icons/icon-1024.png",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },

  android: {
    package: "casper.yourfuture.V1",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./assets/icons/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
    "extra": {
      "eas": {
        "projectId": "35abaab1-bcbb-4ef8-8502-70193c953994"
      }
    }
});

#!/bin/bash
set -e

export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export ANDROID_HOME=$HOME/android-sdk
export PATH=$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 22

cd $HOME/BacklogTracker

echo "==> Installing npm dependencies"
npm ci

echo "==> Building web assets"
npm run build

echo "==> Syncing Capacitor"
npx cap sync android

echo "==> Writing local.properties"
echo "sdk.dir=$ANDROID_HOME" > $HOME/BacklogTracker/android/local.properties

echo "==> Building debug APK"
cd android
./gradlew assembleDebug

echo "==> Moving apk to" $HOME
mv $HOME/BacklogTracker/android/app/build/outputs/apk/debug/*.apk $HOME
echo ""
echo "Done."

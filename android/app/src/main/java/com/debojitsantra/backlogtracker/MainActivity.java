package com.debojitsantra.backlogtracker;

import android.os.Bundle;
import android.webkit.JavascriptInterface;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(DownloadPlugin.class);
        super.onCreate(savedInstanceState);
        // The WebView action mode shows a large branded context panel when text is long-pressed.
        // This app intentionally disables text selection and copying, so consume long presses too.
        bridge.getWebView().setLongClickable(false);
        bridge.getWebView().setOnLongClickListener(view -> true);
        bridge.getWebView().addJavascriptInterface(new BackButtonBridge(), "AndroidBackHandler");
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                dispatchBackButton();
            }
        });
    }

    @Override
    public void onBackPressed() {
        dispatchBackButton();
    }

    private void dispatchBackButton() {
        if (bridge != null && bridge.getWebView() != null) {
            bridge.getWebView().evaluateJavascript(
                "window.dispatchEvent(new CustomEvent('android-back-button'))",
                null
            );
        } else {
            super.onBackPressed();
        }
    }

    private class BackButtonBridge {
        @JavascriptInterface
        public void exitApp() {
            runOnUiThread(() -> finishAndRemoveTask());
        }
    }
}

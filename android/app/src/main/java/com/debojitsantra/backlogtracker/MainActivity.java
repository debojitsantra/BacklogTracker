package com.debojitsantra.backlogtracker;

import android.os.Bundle;
import android.webkit.JavascriptInterface;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(DownloadPlugin.class);
        super.onCreate(savedInstanceState);
        bridge.getWebView().addJavascriptInterface(new BackButtonBridge(), "AndroidBackHandler");
    }

    @Override
    public void onBackPressed() {
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

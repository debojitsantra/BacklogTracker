package com.debojitsantra.backlogtracker;

import android.os.Bundle;
import android.webkit.JavascriptInterface;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private final TextMenuBridge textMenuBridge = new TextMenuBridge();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(DownloadPlugin.class);
        super.onCreate(savedInstanceState);
        // Suppress branded WebView selection UI except for JSON text areas, where Android's
        // normal cut/copy/paste menu is needed.
        bridge.getWebView().setLongClickable(true);
        bridge.getWebView().setOnLongClickListener(view -> !textMenuBridge.isEnabled());
        bridge.getWebView().addJavascriptInterface(new BackButtonBridge(), "AndroidBackHandler");
        bridge.getWebView().addJavascriptInterface(textMenuBridge, "AndroidTextMenu");
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

    private static class TextMenuBridge {
        private volatile boolean enabled;

        @JavascriptInterface
        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public boolean isEnabled() {
            return enabled;
        }
    }
}

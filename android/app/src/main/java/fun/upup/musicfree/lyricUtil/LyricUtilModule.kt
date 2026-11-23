package `fun`.upup.musicfree.lyricUtil

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.util.Log
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.*
import java.util.*

class LyricUtilModule(private val reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "LyricUtil"
    private var lyricView: LyricView? = null

    @ReactMethod
    fun checkSystemAlertPermission(promise: Promise) {
        try {
            promise.resolve(Settings.canDrawOverlays(reactContext))
        } catch (e: Exception) {
            // 部分车机裁剪了悬浮窗能力，按「不支持」处理，避免 JS 侧未捕获异常
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun requestSystemAlertPermission(promise: Promise) {
        try {
            val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION).apply {
                data = Uri.parse("package:" + reactContext.packageName)
            }
            val activity = currentActivity
            if (activity != null) {
                activity.startActivity(intent)
            } else {
                reactContext.startActivity(intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
            }
            promise.resolve(true)
        } catch (e: Exception) {
            // 车机可能没有悬浮窗设置页，退回到应用详情页
            try {
                val fallback = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                    data = Uri.parse("package:" + reactContext.packageName)
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                reactContext.startActivity(fallback)
            } catch (_: Exception) {
            }
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun showStatusBarLyric(initLyric: String?, options: ReadableMap?, promise: Promise) {
        try {
            UiThreadUtil.runOnUiThread {
                if (lyricView == null) {
                    lyricView = LyricView(reactContext)
                }

                val mapOptions = mutableMapOf<String, Any>().apply {
                    if (options == null) {
                        return@apply
                    }
                    if (options.hasKey("topPercent")) {
                        put("topPercent", options.getDouble("topPercent"))
                    }
                    if (options.hasKey("leftPercent")) {
                        put("leftPercent", options.getDouble("leftPercent"))
                    }
                    if (options.hasKey("align")) {
                        put("align", options.getInt("align"))
                    }
                    if (options.hasKey("color")) {
                        options.getString("color")?.let { put("color", it) }
                    }
                    if (options.hasKey("backgroundColor")) {
                        options.getString("backgroundColor")?.let { put("backgroundColor", it) }
                    }
                    if (options.hasKey("widthPercent")) {
                        put("widthPercent", options.getDouble("widthPercent"))
                    }
                    if (options.hasKey("fontSize")) {
                        put("fontSize", options.getDouble("fontSize"))
                    }
                }

                try {
                    lyricView?.showLyricWindow(initLyric, mapOptions)
                    promise.resolve(true)
                } catch (e: Exception) {
                    promise.reject("Exception", e.message)
                }
            }
        } catch (e: Exception) {
            promise.reject("Exception", e.message)
        }
    }

    @ReactMethod
    fun hideStatusBarLyric(promise: Promise) {
        try {
            UiThreadUtil.runOnUiThread {
                lyricView?.hideLyricWindow()
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("Exception", e.message)
        }
    }

    @ReactMethod
    fun setStatusBarLyricText(lyric: String, promise: Promise) {
        try {
            UiThreadUtil.runOnUiThread {
                lyricView?.setText(lyric)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("Exception", e.message)
        }
    }

    @ReactMethod
    fun setStatusBarLyricAlign(alignment: Int, promise: Promise) {
        try {
            UiThreadUtil.runOnUiThread {
                lyricView?.setAlign(alignment)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("Exception", e.message)
        }
    }

    @ReactMethod
    fun setStatusBarLyricTop(pct: Double, promise: Promise) {
        try {
            UiThreadUtil.runOnUiThread {
                lyricView?.setTopPercent(pct)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("Exception", e.message)
        }
    }

    @ReactMethod
    fun setStatusBarLyricLeft(pct: Double, promise: Promise) {
        try {
            UiThreadUtil.runOnUiThread {
                lyricView?.setLeftPercent(pct)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("Exception", e.message)
        }
    }

    @ReactMethod
    fun setStatusBarLyricWidth(pct: Double, promise: Promise) {
        try {
            UiThreadUtil.runOnUiThread {
                lyricView?.setWidth(pct)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("Exception", e.message)
        }
    }

    @ReactMethod
    fun setStatusBarLyricFontSize(fontSize: Float, promise: Promise) {
        try {
            UiThreadUtil.runOnUiThread {
                lyricView?.setFontSize(fontSize)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("Exception", e.message)
        }
    }

    @ReactMethod
    fun setStatusBarColors(textColor: String?, backgroundColor: String?, promise: Promise) {
        try {
            UiThreadUtil.runOnUiThread {
                lyricView?.setColors(textColor, backgroundColor)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("Exception", e.message)
        }
    }

}

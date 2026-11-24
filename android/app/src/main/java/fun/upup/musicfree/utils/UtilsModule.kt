package `fun`.upup.musicfree.utils; // replace your-apps-package-name with your app’s package name
import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.content.res.Configuration
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.os.PowerManager
import android.provider.Settings
import android.util.DisplayMetrics
import android.view.WindowInsets
import android.view.WindowManager
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import kotlin.system.exitProcess

class UtilsModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {

    private val reactContext: ReactApplicationContext = context;

    override fun getName() = "NativeUtils"

    @ReactMethod
    fun exitApp() {
        val activity = reactContext.currentActivity
        activity?.finishAndRemoveTask()
        android.os.Process.killProcess(android.os.Process.myPid())
        exitProcess(0)
    }

    /** targetSdk >= 30 且 Android 11+ 才使用「所有文件访问」；车机（targetSdk 29）走传统存储权限 */
    private fun useAllFilesAccess(): Boolean {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.R &&
            reactContext.applicationInfo.targetSdkVersion >= Build.VERSION_CODES.R
    }

    private fun hasRuntimeStoragePermission(): Boolean {
        val readPermission = ContextCompat.checkSelfPermission(
            reactContext,
            Manifest.permission.READ_EXTERNAL_STORAGE,
        ) == PackageManager.PERMISSION_GRANTED || (
            Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
                ContextCompat.checkSelfPermission(
                    reactContext,
                    Manifest.permission.READ_MEDIA_AUDIO,
                ) == PackageManager.PERMISSION_GRANTED
            )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            // Android 11+ 传统存储模式下，读权限即可覆盖应用可访问的媒体文件
            return readPermission
        }
        val writePermission = ContextCompat.checkSelfPermission(
            reactContext,
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
        ) == PackageManager.PERMISSION_GRANTED
        return readPermission && writePermission
    }

    @ReactMethod
    fun checkStoragePermission(promise: Promise) {
        if (useAllFilesAccess() && Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            promise.resolve(Environment.isExternalStorageManager())
        } else {
            promise.resolve(hasRuntimeStoragePermission())
        }
    }

    @ReactMethod
    fun requestStoragePermission() {
        val activity = reactContext.currentActivity
        if (useAllFilesAccess() && Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            val intent = Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION).apply {
                data = Uri.parse("package:${reactContext.packageName}")
            }
            try {
                if (activity != null) {
                    activity.startActivity(intent)
                } else {
                    reactContext.startActivity(intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
                }
            } catch (_: Exception) {
                openAppDetailsSettings()
            }
            return
        }

        if (activity != null) {
            val permissions = mutableListOf(
                Manifest.permission.READ_EXTERNAL_STORAGE,
                Manifest.permission.WRITE_EXTERNAL_STORAGE,
            )
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                permissions.add(Manifest.permission.READ_MEDIA_AUDIO)
            }
            ActivityCompat.requestPermissions(
                activity,
                permissions.toTypedArray(),
                1001,
            )
        } else {
            openAppDetailsSettings()
        }
    }

    @ReactMethod
    fun openAppDetailsSettings() {
        val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
            data = Uri.parse("package:${reactContext.packageName}")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        try {
            reactContext.startActivity(intent)
        } catch (_: Exception) {
        }
    }

    private fun carPrefs() =
        reactContext.getSharedPreferences("musicfree_car", Context.MODE_PRIVATE)

    /** 开机自启动开关，BootReceiver 读取同一个 SharedPreferences */
    @ReactMethod
    fun setAutoStartOnBoot(enabled: Boolean) {
        carPrefs().edit().putBoolean("auto_start_on_boot", enabled).apply()
    }

    @ReactMethod
    fun isAutoStartOnBootEnabled(promise: Promise) {
        promise.resolve(carPrefs().getBoolean("auto_start_on_boot", false))
    }

    /** 全局显示大小（rpx 系数），需要重启应用生效 */
    @ReactMethod
    fun setUiScale(scale: Double) {
        carPrefs().edit().putFloat("ui_scale", scale.toFloat()).apply()
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getUiScale(): Double {
        return carPrefs().getFloat("ui_scale", 1.0f).toDouble()
    }

    /** 打开系统默认应用设置；BYD 的默认音乐通常在「小迪设置 → 音乐」中 */
    @ReactMethod
    fun openDefaultAppsSettings() {
        val intent = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            Intent(Settings.ACTION_MANAGE_DEFAULT_APPS_SETTINGS)
        } else {
            Intent(Settings.ACTION_SETTINGS)
        }
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        try {
            val activity = reactContext.currentActivity
            if (activity != null) {
                activity.startActivity(intent)
            } else {
                reactContext.startActivity(intent)
            }
        } catch (_: Exception) {
            openAppDetailsSettings()
        }
    }

    @ReactMethod
    fun isIgnoringBatteryOptimizations(promise: Promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val powerManager = reactContext.getSystemService(Context.POWER_SERVICE) as? PowerManager
            promise.resolve(powerManager?.isIgnoringBatteryOptimizations(reactContext.packageName) == true)
        } else {
            promise.resolve(true)
        }
    }

    @ReactMethod
    fun requestIgnoreBatteryOptimizations() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return
        }
        val powerManager = reactContext.getSystemService(Context.POWER_SERVICE) as? PowerManager
        if (powerManager?.isIgnoringBatteryOptimizations(reactContext.packageName) == true) {
            return
        }
        val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
            data = Uri.parse("package:${reactContext.packageName}")
        }
        try {
            val activity = reactContext.currentActivity
            if (activity != null) {
                activity.startActivity(intent)
            } else {
                reactContext.startActivity(intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
            }
        } catch (_: Exception) {
            try {
                val settingsIntent = Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS)
                val activity = reactContext.currentActivity
                if (activity != null) {
                    activity.startActivity(settingsIntent)
                } else {
                    reactContext.startActivity(settingsIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
                }
            } catch (_: Exception) {
                openAppDetailsSettings()
            }
        }
    }

    /** 车机设备信息，供 JS 侧自动识别车机/大屏并切换布局 */
    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getDeviceInfo(): WritableMap {
        val configuration = reactContext.resources.configuration
        val packageManager = reactContext.packageManager
        val brand = Build.BRAND ?: ""
        val manufacturer = Build.MANUFACTURER ?: ""
        val model = Build.MODEL ?: ""
        val deviceText = "$brand $manufacturer $model".lowercase()

        val uiMode = when (configuration.uiMode and Configuration.UI_MODE_TYPE_MASK) {
            Configuration.UI_MODE_TYPE_CAR -> "car"
            Configuration.UI_MODE_TYPE_DESK -> "desk"
            Configuration.UI_MODE_TYPE_TELEVISION -> "television"
            Configuration.UI_MODE_TYPE_APPLIANCE -> "appliance"
            Configuration.UI_MODE_TYPE_WATCH -> "watch"
            else -> "normal"
        }

        return Arguments.createMap().apply {
            putString("brand", brand)
            putString("manufacturer", manufacturer)
            putString("model", model)
            putString("device", Build.DEVICE ?: "")
            putString("product", Build.PRODUCT ?: "")
            putString("uiMode", uiMode)
            putInt("sdkInt", Build.VERSION.SDK_INT)
            putInt("smallestScreenWidthDp", configuration.smallestScreenWidthDp)
            putBoolean(
                "isAutomotive",
                packageManager.hasSystemFeature(PackageManager.FEATURE_AUTOMOTIVE),
            )
            putBoolean(
                "isLeanback",
                packageManager.hasSystemFeature(PackageManager.FEATURE_LEANBACK),
            )
            putBoolean(
                "isTelevision",
                packageManager.hasSystemFeature(PackageManager.FEATURE_TELEVISION),
            )
            putBoolean(
                "isByd",
                deviceText.contains("byd") ||
                    deviceText.contains("dilink") ||
                    deviceText.contains("比亚迪") ||
                    deviceText.contains("denza") ||
                    deviceText.contains("腾势"),
            )
            putBoolean("isLegacyStorage", !useAllFilesAccess())
        }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getWindowDimensions(): WritableMap {
        val windowManager = reactApplicationContext.getSystemService(Context.WINDOW_SERVICE) as WindowManager
        val displayMetrics: DisplayMetrics = reactApplicationContext.resources.displayMetrics
        val density = displayMetrics.density

        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            // Android 11 (API 30) 及以上使用新 API
            val windowMetrics = windowManager.currentWindowMetrics
            val insets = windowMetrics.windowInsets.getInsetsIgnoringVisibility(WindowInsets.Type.systemBars())
            val bounds = windowMetrics.bounds

            val totalWidthPx = bounds.width()
            val totalHeightPx = bounds.height()

            val leftInsetPx = insets.left
            val rightInsetPx = insets.right
            val topInsetPx = insets.top
            val bottomInsetPx = insets.bottom

            val usableWidthPx = totalWidthPx - leftInsetPx - rightInsetPx
            val usableHeightPx = totalHeightPx - topInsetPx - bottomInsetPx

            val usableWidthDp = usableWidthPx / density
            val usableHeightDp = usableHeightPx / density

            Arguments.createMap().apply {
                putDouble("width", usableWidthDp.toDouble())
                putDouble("height", usableHeightDp.toDouble())
            }
        } else {
            // Android 10 及以下使用旧 API
            val display = windowManager.defaultDisplay
            val realSize = android.graphics.Point()
            display.getRealSize(realSize)

            // 获取状态栏和导航栏高度
            val resources = reactApplicationContext.resources
            var statusBarHeight = 0
            var navigationBarHeight = 0

            // 状态栏高度
            val statusBarResourceId = resources.getIdentifier("status_bar_height", "dimen", "android")
            if (statusBarResourceId > 0) {
                statusBarHeight = resources.getDimensionPixelSize(statusBarResourceId)
            }

            // 导航栏高度
            val navigationBarResourceId = resources.getIdentifier("navigation_bar_height", "dimen", "android")
            if (navigationBarResourceId > 0) {
                navigationBarHeight = resources.getDimensionPixelSize(navigationBarResourceId)
            }

            val usableWidthPx = realSize.x
            val usableHeightPx = realSize.y - statusBarHeight - navigationBarHeight

            val usableWidthDp = usableWidthPx / density
            val usableHeightDp = usableHeightPx / density

            Arguments.createMap().apply {
                putDouble("width", usableWidthDp.toDouble())
                putDouble("height", usableHeightDp.toDouble())
            }
        }
    }
}

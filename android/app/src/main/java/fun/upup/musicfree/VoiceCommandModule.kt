package `fun`.upup.musicfree

import android.content.Context
import android.content.Intent
import android.provider.SearchManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule

/**
 * 接收 Android 标准语音播放 Intent：
 * - android.media.action.MEDIA_PLAY_FROM_SEARCH
 * - android.media.action.MEDIA_PLAY_FROM_URI
 *
 * 小迪/Android Auto/其他语音助手如果使用标准接口，会走到这里。
 * 未使用标准接口的比亚迪私有协议需要额外抓包适配。
 */
@ReactModule(name = VoiceCommandModule.NAME)
class VoiceCommandModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = NAME

    // NativeEventEmitter 需要这两个方法
    @ReactMethod
    fun addListener(eventName: String) {}

    @ReactMethod
    fun removeListeners(count: Int) {}

    /** JS 侧注册好监听后调用，之后的新指令直接 emit */
    @ReactMethod
    fun markReady() {
        isReady = true
    }

    /** 冷启动时 JS 还没准备好，先存下指令，启动完成后读取一次 */
    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getPendingCommand(): WritableMap? {
        val command = pendingCommand ?: return null
        pendingCommand = null
        return command
    }

    companion object {
        const val NAME = "VoiceCommand"
        private const val ACTION_PLAY_FROM_SEARCH = "android.media.action.MEDIA_PLAY_FROM_SEARCH"
        private const val ACTION_PLAY_FROM_URI = "android.media.action.MEDIA_PLAY_FROM_URI"

        private var isReady = false
        private var pendingCommand: WritableMap? = null
        private var appContext: ReactApplicationContext? = null

        fun handleIntent(_context: Context, intent: Intent?) {
            val safeIntent = intent ?: return
            val action = safeIntent.action ?: return
            val command = when (action) {
                ACTION_PLAY_FROM_SEARCH -> {
                    val query = safeIntent.getStringExtra(SearchManager.QUERY)
                        ?: safeIntent.getStringExtra("query")
                        ?: safeIntent.getStringExtra(SearchManager.USER_QUERY)
                        ?: safeIntent.getStringExtra(Intent.EXTRA_TEXT)
                    if (query.isNullOrBlank()) {
                        null
                    } else {
                        Arguments.createMap().apply {
                            putString("type", "search")
                            putString("query", query)
                        }
                    }
                }

                ACTION_PLAY_FROM_URI -> {
                    val uri = safeIntent.dataString
                        ?: safeIntent.getStringExtra(Intent.EXTRA_STREAM)
                    if (uri.isNullOrBlank()) {
                        null
                    } else {
                        Arguments.createMap().apply {
                            putString("type", "uri")
                            putString("uri", uri)
                        }
                    }
                }

                else -> null
            } ?: return

            val contextRef = appContext
            if (contextRef != null && isReady) {
                try {
                    contextRef.getJSModule(
                        DeviceEventManagerModule.RCTDeviceEventEmitter::class.java,
                    ).emit("VoiceCommandEvent", command)
                    return
                } catch (_: Exception) {
                    // JS 上下文可能正在销毁，退回 pending
                }
            }
            pendingCommand = command
        }
    }

    init {
        appContext = reactContext
        isReady = false
    }
}

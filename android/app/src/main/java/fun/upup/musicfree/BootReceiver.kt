package `fun`.upup.musicfree

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/**
 * 开机自启动。是否真正生效取决于车机是否允许后台启动 Activity，
 * BYD DiLink 需要在系统设置中把本应用加入自启动白名单。
 */
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent?) {
        val action = intent?.action ?: return
        if (action != Intent.ACTION_BOOT_COMPLETED &&
            action != "android.intent.action.QUICKBOOT_POWERON" &&
            action != "com.htc.intent.action.QUICKBOOT_POWERON"
        ) {
            return
        }

        val prefs = context.getSharedPreferences("musicfree_car", Context.MODE_PRIVATE)
        if (!prefs.getBoolean("auto_start_on_boot", false)) {
            return
        }

        try {
            val launch = Intent(context, MainActivity::class.java).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
            }
            context.startActivity(launch)
        } catch (_: Exception) {
            // Android 10+ 可能禁止后台启动 Activity，交给系统自启动白名单
        }
    }
}

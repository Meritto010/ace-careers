# Keep Supabase and Postgrest classes
-keep class io.supabase.** { *; }
-keep class io.github.jan.supabase.** { *; }

# Keep OkHttp (used by Supabase for networking)
-dontwarn okhttp3.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

# Keep serialization for your JSON responses
-keep class kotlinx.serialization.** { *; }

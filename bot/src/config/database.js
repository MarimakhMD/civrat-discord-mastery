// ═══════════════════════════════════════════════════
// DATABASE CONNECTIONS - MongoDB + Supabase
// ═══════════════════════════════════════════════════

const mongoose = require("mongoose");
const { createClient } = require("@supabase/supabase-js");
const { config } = require("./index");
const logger = require("../utils/logger");

// ═══════════════════════════════════════════════════
// MONGODB - For analytics, XP, runtime state only
// ═══════════════════════════════════════════════════

async function connectMongo() {
  if (!config.mongoUri) {
    logger.warn("MongoDB URI not configured - analytics features disabled");
    return null;
  }

  try {
    await mongoose.connect(config.mongoUri, {
      dbName: config.mongoDbName,
    });
    logger.success("MongoDB connecté (analytics/XP/runtime)");
    return mongoose;
  } catch (err) {
    logger.error("MongoDB connection failed:", err.message);
    return null;
  }
}

// ═══════════════════════════════════════════════════
// SUPABASE - Single source of truth for guild config
// ═══════════════════════════════════════════════════

function createSupabaseClient() {
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    logger.error("Supabase not configured - bot will not function correctly");
    return null;
  }

  // The service role is server-only and is never exposed to the dashboard.
  // Keep the anon-key fallback for the current controlled-test deployment; a
  // future strict RLS rollout must configure SUPABASE_SERVICE_ROLE_KEY.
  const serverKey = config.supabaseServiceRoleKey || config.supabaseAnonKey;
  if (!config.supabaseServiceRoleKey) logger.warn("SUPABASE_SERVICE_ROLE_KEY missing; bot is using anon-key compatibility mode");
  const supabase = createClient(config.supabaseUrl, serverKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  logger.success("Supabase server client created (guild config source)");
  return supabase;
}

const supabase = createSupabaseClient();

module.exports = { connectMongo, supabase, mongoose };

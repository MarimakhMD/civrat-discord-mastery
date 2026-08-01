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

  const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  logger.success("Supabase client créé (guild config source)");
  return supabase;
}

// Create the global Supabase client
const supabase = createSupabaseClient();

module.exports = {
  connectMongo,
  supabase,
  mongoose,
};

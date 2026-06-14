// @ts-nocheck
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import process from "node:process";

function getServerSupabase() {
  return createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY!,
  );
}

// ── Guild Config ──────────────────────────────────────────────────────────

export const getGuildConfig = createServerFn({ method: "POST" })
  .inputValidator(z.object({ guild_id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const supabase = getServerSupabase();
    const { data: config, error } = await supabase
      .from("guild_configs")
      .select("*")
      .eq("guild_id", data.guild_id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return config;
  });

export const updateGuildConfig = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    guild_id: z.string().min(1),
    updates: z.record(z.unknown()),
  }))
  .handler(async ({ data }) => {
    const supabase = getServerSupabase();
    const { error } = await supabase
      .from("guild_configs")
      .upsert(
        { ...data.updates, guild_id: data.guild_id, updated_at: new Date().toISOString() },
        { onConflict: "guild_id" },
      );
    if (error) throw new Error(error.message);
    return { success: true };
  });

// ── Giveaways ─────────────────────────────────────────────────────────────

export const getGiveaways = createServerFn({ method: "POST" })
  .inputValidator(z.object({ guild_id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const supabase = getServerSupabase();
    const { data: giveaways, error } = await supabase
      .from("giveaways")
      .select("*")
      .eq("guild_id", data.guild_id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return giveaways;
  });

export const createGiveaway = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    guild_id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional(),
    duration_hours: z.number().min(1).max(720),
    winners_count: z.number().min(1).max(20),
    channel_id: z.string().optional(),
    requirements: z.string().optional(),
  }))
  .handler(async ({ data }) => {
    const supabase = getServerSupabase();
    const duration = data.duration_hours * 3600;
    const ends_at = new Date(Date.now() + duration * 1000).toISOString();
    const { data: giveaway, error } = await supabase
      .from("giveaways")
      .insert({
        guild_id: data.guild_id,
        title: data.title,
        description: data.description ?? "",
        channel_id: data.channel_id ?? null,
        duration,
        winners_count: data.winners_count,
        requirements: data.requirements ?? "",
        active: true,
        status: "active",
        ends_at,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return giveaway;
  });

export const endGiveaway = createServerFn({ method: "POST" })
  .inputValidator(z.object({ giveaway_id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const supabase = getServerSupabase();
    const { error } = await supabase
      .from("giveaways")
      .update({ active: false, status: "ended", ended_at: new Date().toISOString() })
      .eq("id", data.giveaway_id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

// ── Suggestions ───────────────────────────────────────────────────────────

export const getSuggestions = createServerFn({ method: "POST" })
  .inputValidator(z.object({ guild_id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const supabase = getServerSupabase();
    const { data: suggestions, error } = await supabase
      .from("suggestions")
      .select("*")
      .eq("guild_id", data.guild_id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return suggestions;
  });

export const updateSuggestionStatus = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    suggestion_id: z.string().min(1),
    status: z.enum(["approved", "rejected", "pending"]),
  }))
  .handler(async ({ data }) => {
    const supabase = getServerSupabase();
    const { error } = await supabase
      .from("suggestions")
      .update({ status: data.status })
      .eq("id", data.suggestion_id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

// ── Tickets ───────────────────────────────────────────────────────────────

export const getTickets = createServerFn({ method: "POST" })
  .inputValidator(z.object({ guild_id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const supabase = getServerSupabase();
    const { data: tickets, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("guild_id", data.guild_id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return tickets;
  });

export const closeTicket = createServerFn({ method: "POST" })
  .inputValidator(z.object({ ticket_id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const supabase = getServerSupabase();
    const { error } = await supabase
      .from("tickets")
      .update({ closed: true, status: "closed", closed_at: new Date().toISOString() })
      .eq("id", data.ticket_id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

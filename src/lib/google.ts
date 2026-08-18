import { google } from 'googleapis';
import { createAdminClient } from '@/lib/supabase/admin';

export const GOOGLE_CALENDAR_SCOPES = ['https://www.googleapis.com/auth/calendar'];

export function isGoogleConfigured(): boolean {
    return Boolean(
        process.env.GOOGLE_CLIENT_ID &&
        process.env.GOOGLE_CLIENT_SECRET &&
        process.env.GOOGLE_REDIRECT_URI
    );
}

export function getCalendarId(): string {
    return (
        process.env.GOOGLE_CALENDAR_ID ||
        process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_EMAIL ||
        'primary'
    );
}

export function getOAuthClient() {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
}

export function getAuthUrl(state: string): string {
    const oauth2Client = getOAuthClient();
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: GOOGLE_CALENDAR_SCOPES,
        state,
    });
}

export async function exchangeCode(code: string) {
    const oauth2Client = getOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const tokenInfo = await oauth2Client.getTokenInfo(tokens.access_token!);

    return {
        tokens,
        email: tokenInfo.email ?? null,
    };
}

type StoredToken = {
    access_token: string | null;
    refresh_token: string | null;
    expiry_at: string | null;
};

export async function getStoredToken(userId: string): Promise<StoredToken | null> {
    const supabase = createAdminClient();
    const { data } = await supabase
        .from('calendar_tokens')
        .select('access_token, refresh_token, expiry_at')
        .eq('user_id', userId)
        .single();

    return data ?? null;
}

export async function getAuthorizedClient(userId: string) {
    if (!isGoogleConfigured()) return null;

    const stored = await getStoredToken(userId);
    if (!stored?.refresh_token) return null;

    const oauth2Client = getOAuthClient();
    oauth2Client.setCredentials({
        access_token: stored.access_token ?? undefined,
        refresh_token: stored.refresh_token,
        expiry_date: stored.expiry_at ? new Date(stored.expiry_at).getTime() : undefined,
    });

    oauth2Client.on('tokens', async (tokens) => {
        const supabase = createAdminClient();
        await supabase
            .from('calendar_tokens')
            .update({
                access_token: tokens.access_token ?? null,
                expiry_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);
    });

    return oauth2Client;
}

export const calendar = google.calendar({ version: 'v3' });

export type GoogleTaskInput = {
    title: string;
    description?: string | null;
    start_at?: string | null;
    end_at?: string | null;
};

function toGoogleDateTime(iso?: string | null) {
    if (!iso) return undefined;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return undefined;
    return d.toISOString();
}

export async function createCalendarEvent(
    auth: ReturnType<typeof getOAuthClient>,
    task: GoogleTaskInput
): Promise<string> {
    const res = await calendar.events.insert({
        auth,
        calendarId: getCalendarId(),
        requestBody: {
            summary: task.title,
            description: task.description ?? undefined,
            start: {
                dateTime: toGoogleDateTime(task.start_at) ?? new Date().toISOString(),
            },
            end: {
                dateTime:
                    toGoogleDateTime(task.end_at) ??
                    new Date(new Date(task.start_at ?? Date.now()).getTime() + 60 * 60 * 1000).toISOString(),
            },
        },
    });
    return res.data.id!;
}

export async function updateCalendarEvent(
    auth: ReturnType<typeof getOAuthClient>,
    eventId: string,
    task: GoogleTaskInput
): Promise<void> {
    await calendar.events.patch({
        auth,
        calendarId: getCalendarId(),
        eventId,
        requestBody: {
            summary: task.title,
            description: task.description ?? undefined,
            start: {
                dateTime: toGoogleDateTime(task.start_at) ?? new Date().toISOString(),
            },
            end: {
                dateTime:
                    toGoogleDateTime(task.end_at) ??
                    new Date(new Date(task.start_at ?? Date.now()).getTime() + 60 * 60 * 1000).toISOString(),
            },
        },
    });
}

export async function deleteCalendarEvent(
    auth: ReturnType<typeof getOAuthClient>,
    eventId: string
): Promise<void> {
    try {
        await calendar.events.delete({ auth, calendarId: getCalendarId(), eventId });
    } catch {
        // event might already be deleted
    }
}

export async function listCalendarEvents(
    auth: ReturnType<typeof getOAuthClient>,
    opts: { maxResults?: number; timeMin?: Date; timeMax?: Date } = {}
): Promise<
    Array<{
        id: string;
        summary: string | null | undefined;
        description: string | null | undefined;
        start: string | null;
        end: string | null;
    }>
> {
    const res = await calendar.events.list({
        auth,
        calendarId: getCalendarId(),
        timeMin: (opts.timeMin ?? new Date()).toISOString(),
        timeMax: opts.timeMax?.toISOString(),
        maxResults: opts.maxResults ?? 250,
        singleEvents: true,
        orderBy: 'startTime',
    });

    return (res.data.items ?? [])
        .filter((item) => item.status !== 'cancelled')
        .map((item) => ({
            id: item.id!,
            summary: item.summary,
            description: item.description,
            start: item.start?.dateTime ?? item.start?.date ?? null,
            end: item.end?.dateTime ?? item.end?.date ?? null,
        }));
}
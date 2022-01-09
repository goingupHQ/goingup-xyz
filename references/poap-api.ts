import queryString from "query-string";
import { authClient } from "./auth";

declare const window: any;
const RECAPTCHA_KEY = process.env.REACT_APP_RECAPTCHA_V3_KEY || "";

export type Address = string;
export type Params = {
    [key: string]: string | number | boolean | undefined;
};

export enum EventSecretType {
    word = "word",
    website = "website",
}

export interface TemplatesResponse<Result> {
    total: number;
    next?: string;
    previous?: string;
    event_templates: Result[];
}

export interface TokenInfo {
    tokenId: string;
    owner: string;
    event: PoapEvent;
    ownerText?: string;
    layer: string;
    ens?: any;
}

export type QrCodesListAssignResponse = {
    success: boolean;
    alreadyclaimedQrs: string[];
};

export interface PoapEvent {
    id: number;
    fancy_id: string;
    signer: Address;
    signer_ip: string;
    name: string;
    description: string;
    city: string;
    country: string;
    event_url: string;
    event_template_id: number;
    from_admin: boolean;
    image_url: string;
    year: number;
    start_date: string;
    end_date: string;
    expiry_date: string;
    virtual_event: boolean;
    email?: string;
    private_event?: boolean;
}

export interface RedeemRequest {
    id: number;
    event_id: number;
    requested_codes: number;
    accepted_codes: number;
    created_date: string;
    type: RedeemRequestType;
    reviewed: boolean;
    reviewed_by?: string;
    reviewed_date?: string;
    event: PoapEvent;
    eventSecret?: EventWebsite;
}

export interface RedeemRequestCount {
    active: number;
    type: RedeemRequestType;
}

export enum RedeemRequestType {
    qr_code = "qr_code",
    secret_website = "secret_website",
    secret_word = "secret_word",
}

export interface EventWebsite {
    id: number;
    event_id: number;
    claim_name: string;
    from?: Date;
    to?: Date;
    captcha: boolean;
    created_date: Date;
    reviewed: boolean;
    reviewed_by?: string;
    reviewed_date?: Date;
    type?: EventSecretType;
}

export interface SortCondition {
    sort_by: string;
    sort_direction: SortDirection;
}

export enum SortDirection {
    ascending = "asc",
    descending = "desc",
}

export interface PoapFullEvent extends PoapEvent {
    secret_code?: string;
    email?: string;
}

export interface Claim extends ClaimProof {
    claimerSignature: string;
}

export interface ClaimProof {
    claimId: string;
    eventId: number;
    claimer: Address;
    proof: string;
}

export type Template = {
    id: number;
    name: string;
    title_image: string;
    title_link: string;
    header_link_text: string;
    header_link_url: string;
    header_color: string;
    header_link_color: string;
    main_color: string;
    footer_color: string;
    left_image_url: string;
    left_image_link: string;
    right_image_url: string;
    right_image_link: string;
    mobile_image_url: string;
    mobile_image_link: string;
    footer_icon: string;
    secret_code: string;
};
export type TemplatePageFormValues = {
    name: string;
    title_image: Blob | string;
    title_link: string;
    header_link_text: string;
    header_link_url: string;
    header_color: string;
    header_link_color: string;
    main_color: string;
    footer_color: string;
    left_image_url: Blob | string;
    left_image_link: string;
    right_image_url: Blob | string;
    right_image_link: string;
    mobile_image_url: Blob | string;
    mobile_image_link: string;
    footer_icon: Blob | string;
    secret_code: string;
    email: string;
};
export type EventTemplate = {
    created_date: string;
    footer_color: string;
    footer_icon: string;
    header_color: string;
    header_link_color: string;
    header_link_text: string;
    header_link_url: string;
    id: number;
    is_active: boolean;
    left_image_link: string;
    left_image_url: string;
    main_color: string;
    mobile_image_link: string;
    mobile_image_url: string;
    name: string;
    right_image_link: string;
    right_image_url: string;
    title_image: string;
    title_link: string;
};

export interface QrResult {
    token: number;
}

export interface HashClaim {
    id: number;
    qr_hash: string;
    tx_hash: string;
    tx: Transaction;
    event_id: number;
    event: PoapEvent;
    event_template: EventTemplate | null;
    beneficiary: Address;
    user_input: string | null;
    signer: Address;
    claimed: boolean;
    claimed_date: string;
    created_date: string;
    tx_status?: string;
    secret: string;
    delegated_mint: boolean;
    delegated_signed_message: string;
    result: QrResult | null;
    queue_uid?: string;
}

export interface PoapSetting {
    id: number;
    name: string;
    type: string;
    value: string;
}

export interface AdminAddress {
    id: number;
    signer: Address;
    role: string;
    gas_price: string;
    balance: string;
    created_date: string;
    pending_tx: number;
}

export enum TransactionStatus {
    WAITING_TX = "waiting_tx",
    PENDING = "pending",
    PASSED = "passed",
    FAILED = "failed",
    BUMPED = "bumped",
}

export interface Transaction {
    id: number;
    tx_hash: string;
    nonce: number;
    operation: string;
    arguments: string;
    created_date: string;
    gas_price: string;
    signer: string;
    status: TransactionStatus;
    layer: string;
}

export interface PaginatedTransactions {
    limit: number;
    offset: number;
    total: number;
    transactions: Transaction[];
}

export interface EmailClaim {
    id: number;
    email: string;
    token: object;
    end_date: Date;
    processed: boolean;
}

export interface Notification {
    id: number;
    title: string;
    description: string;
    type: string;
    event_id: number;
    event: PoapEvent;
}

export interface PaginatedNotifications {
    limit: number;
    offset: number;
    total: number;
    notifications: Notification[];
}

export interface AdminLog {
    id: number;
    event_id: number;
    action: string;
    created_date: string;
    request_params: string;
    response_code: number;
    response: string;
    auth0_email: string;
    agent_vars: string;
    ip: string;
}

export interface PaginatedAdminLogs {
    limit: number;
    offset: number;
    total: number;
    admin_logs: AdminLog[];
}

export interface AdminLogAction {
    action: string;
    description: string;
}

export type QrCode = {
    beneficiary: string;
    user_input: string | null;
    claimed: boolean;
    claimed_date: string;
    created_date: string;
    event_id: number;
    id: number;
    is_active: boolean;
    scanned: boolean;
    numeric_id: number;
    qr_hash: string;
    qr_roll_id: number;
    tx_hash: string;
    tx_status: TransactionStatus | null;
    event: PoapEvent;
    delegated_mint: boolean;
    delegated_signed_message: string | null;
};

export type PaginatedQrCodes = {
    limit: number;
    offset: number;
    total: number;
    qr_claims: QrCode[];
};

export type PaginatedRedeemRequest = {
    limit: number;
    offset: number;
    total: number;
    redeem_requests: RedeemRequest[];
};

export type ENSQueryResult = { valid: false } | { valid: true; ens: string };

export type AddressQueryResult = { valid: false } | { valid: true; ens: string };

export interface MigrateResponse {
    signature: string;
}

export type eventOptionType = {
    value: number;
    label: string;
    start_date: string;
};

export type QueueResponse = {
    queue_uid: string;
};

type QueueResult = {
    tx_hash: string;
};

export type Queue = {
    uid: string;
    operation: string;
    status: string;
    result: QueueResult | null;
};

export enum QueueStatus {
    finish = "FINISH",
    finish_with_error = "FINISH_WITH_ERROR",
    in_process = "IN_PROCESS",
    pending = "PENDING",
}

const API_BASE =
    process.env.NODE_ENV === "development"
        ? `${process.env.REACT_APP_TEST_API_ROOT}`
        : `${process.env.REACT_APP_API_ROOT}`;

const RECAPTCHA_AUTH =
    process.env.NODE_ENV === "development"
        ? `${process.env.REACT_APP_TEST_RECAPTCHA_AUTH_ROOT}`
        : `${process.env.REACT_APP_RECAPTCHA_AUTH_ROOT}`;

const API_WEBSITES =
    process.env.NODE_ENV === "development"
        ? `${process.env.REACT_APP_TEST_API_WEBSITES}`
        : `${process.env.REACT_APP_API_WEBSITES}`;

const ETH_THE_GRAPH_URL = process.env.REACT_APP_ETH_THE_GRAPH_URL;
const L2_THE_GRAPH_URL = process.env.REACT_APP_L2_THE_GRAPH_URL;

const parseHeaders = (headersInit?: HeadersInit) => {
    const headers = { ...headersInit } as { "Content-Type"?: string | false } & HeadersInit;

    // Remove Content-Type if it's equals to 'multipart/form-data'. In that way te browser
    // will add/complete the correct Content-Type for forms with files.
    if (headers["Content-Type"] === "multipart/form-data") {
        delete headers["Content-Type"];
    } else if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/json; charset=utf-8";
    }

    return headers;
};

async function fetchJson<A>(input: RequestInfo, init?: RequestInit): Promise<A> {
    const reqOptions = {
        ...init,
        headers: parseHeaders(init && init.headers),
    };

    const res = await fetch(input, reqOptions);

    if (!res.ok) {
        const data = await res.clone().json();

        if (data && data.message) {
            throw new Error(data.message);
        }
        if (data && data.error) {
            throw new Error(data.error);
        }

        throw new Error(`Request Failed => statusCode: ${res.status} msg: ${res.statusText}`);
    }

    return await res.json();
}

async function getRecaptchaToken(recaptcha: any, recaptcha_key: string): Promise<string> {
    return new Promise((resolve, _reject) => {
        // First get recaptcha token
        return recaptcha.enterprise.ready(() => {
            // TODO: Change action type
            return recaptcha.enterprise
                .execute(recaptcha_key, { action: "pages/search" })
                .then(async (token: string) => {
                    // We send recaptcha token to get the App Check token
                    resolve(token);
                });
        });
    });
}

async function recaptchaFetchGenericRequest(input: RequestInfo, init?: RequestInit): Promise<Response> {
    // TODO: This is a hotfix to race condition issues
    while (!window.grecaptcha) {
        setTimeout(() => {}, 500);
    }
    let recaptchaToken;
    try {
        recaptchaToken = await getRecaptchaToken(window.grecaptcha, RECAPTCHA_KEY);
    } catch (err) {
        // Handle any errors if the token was not retrieved.
        throw new Error(`App check request failed => message: ${err}`);
    }

    const reqOptions = {
        ...init,
        headers: parseHeaders({
            "google-token": recaptchaToken,
            ...(init && init.headers),
        }),
    };

    return await fetch(input, reqOptions);
}

async function recaptchaFetchJson<A>(input: RequestInfo, init?: RequestInit): Promise<A> {
    const res = await recaptchaFetchGenericRequest(input, init);

    if (!res.ok) {
        const data = await res.json();
        if (data && data.message) throw new Error(data.message);
        throw new Error(`Request failed => statusCode: ${res.status} msg: ${res.statusText}`);
    }

    return await res.json();
}

async function recaptchaFetchJsonNoResponse(input: RequestInfo, init?: RequestInit): Promise<void> {
    const res = await recaptchaFetchGenericRequest(input, init);

    if (!res.ok) {
        const data = await res.json();
        if (data && data.message) throw new Error(data.message);
        throw new Error(`Request failed => statusCode: ${res.status} msg: ${res.statusText}`);
    }
}

async function recaptchaSecureFetchGenericRequest(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const bearer = "Bearer " + (await authClient.getAPIToken());
    const initWithAuth = {
        ...init,
        headers: {
            Authorization: bearer,
            ...(init ? init.headers : {}),
        },
    };

    return await recaptchaFetchGenericRequest(input, initWithAuth);
}

async function recaptchaSecureFetchJsonNoResponse(input: RequestInfo, init?: RequestInit): Promise<void> {
    const res = await recaptchaSecureFetchGenericRequest(input, init);
    if (!res.ok) {
        const data = await res.json();
        if (data && data.message) throw new Error(data.message);
        throw new Error(`Request failed => statusCode: ${res.status} msg: ${res.statusText}`);
    }
}

async function recaptchaSecureFetchJson<A>(input: RequestInfo, init?: RequestInit): Promise<A> {
    const res = await recaptchaSecureFetchGenericRequest(input, init);
    if (!res.ok) {
        const data = await res.json();
        if (data && data.message) throw new Error(data.message);
        throw new Error(`Request failed => statusCode: ${res.status} msg: ${res.statusText}`);
    }
    return await res.json();
}

async function fetchJsonNoResponse<A>(input: RequestInfo, init?: RequestInit): Promise<void> {
    const reqOptions = {
        ...init,
        headers: parseHeaders(init && init.headers),
    };

    const res = await fetch(input, reqOptions);
    if (!res.ok) {
        const data = await res.clone().json();
        if (data && data.message) throw new Error(data.message);
        if (data && data.error) throw new Error(data.error);
        throw new Error(`Request Failed => statusCode: ${res.status} msg: ${res.statusText}`);
    }
}

async function secureFetchNoResponse(input: RequestInfo, init?: RequestInit): Promise<void> {
    const bearer = "Bearer " + (await authClient.getAPIToken());

    const reqOptions = {
        ...init,
        headers: parseHeaders({
            Authorization: bearer,
            ...(init && init.headers),
        }),
    };

    const res = await fetch(input, reqOptions);

    if (!res.ok) {
        const data = await res.clone().json();
        if (data && data.message) throw new Error(data.message);
        if (data && data.error) throw new Error(data.error);
        throw new Error(`Request failed => statusCode: ${res.status} msg: ${res.statusText}`);
    }
}

async function secureFetch<A>(input: RequestInfo, init?: RequestInit): Promise<A> {
    const bearer = "Bearer " + (await authClient.getAPIToken());

    const reqOptions = {
        ...init,
        headers: parseHeaders({
            Authorization: bearer,
            ...(init && init.headers),
        }),
    };

    const res = await fetch(input, reqOptions);

    if (!res.ok) {
        const data = await res.clone().json();
        if (data && data.message) throw new Error(data.message);
        if (data && data.error) throw new Error(data.error);
        throw new Error(`Request Failed => statusCode: ${res.status} msg: ${res.statusText}`);
    }
    return await res.json();
}

export function resolveENS(name: string): Promise<ENSQueryResult> {
    return fetchJson(`${API_BASE}/actions/ens_resolve?name=${encodeURIComponent(name)}`);
}

export function getENSFromAddress(address: Address): Promise<AddressQueryResult> {
    return fetchJson(`${API_BASE}/actions/ens_lookup/${address}`);
}

export function getTokensFor(address: string): Promise<TokenInfo[]> {
    return fetchJson(`${API_BASE}/actions/scan/${address}`);
}

export function getTokenInfo(tokenId: string): Promise<TokenInfo> {
    return fetchJson(`${API_BASE}/token/${tokenId}`);
}

export async function getEvents(expired?: boolean): Promise<PoapEvent[]> {
    const url = `${API_BASE}/events?${queryString.stringify({ expired })}`;
    return authClient.isAuthenticated() ? secureFetch(url) : fetchJson(url);
}

export async function getRedeemRequests(
    limit: number,
    offset: number,
    reviewed?: boolean,
    event_id?: number,
    sort_condition?: SortCondition,
    redeem_type?: string
): Promise<PaginatedRedeemRequest> {
    const sort_by = sort_condition?.sort_by;
    const sort_direction = sort_condition?.sort_direction;

    const params = queryString.stringify(
        {
            limit,
            offset,
            event_id,
            reviewed,
            sort_by,
            sort_direction,
            redeem_type,
        },
        { sort: false }
    );
    try {
        return authClient.isAuthenticated()
            ? secureFetch(`${API_BASE}/redeem-requests?${params}`)
            : fetchJson(`${API_BASE}/redeem-requests?${params}`);
    } catch (e) {
        return e;
    }
}

export async function postRedeemRequests(
    event_id: number,
    requested_codes: number,
    secret_code: string,
    redeem_type: RedeemRequestType
): Promise<void> {
    const body = JSON.stringify({
        event_id,
        requested_codes,
        secret_code,
        redeem_type,
    });

    return authClient.isAuthenticated()
        ? recaptchaSecureFetchJson(`${RECAPTCHA_AUTH}/redeem-requests`, {
              method: "POST",
              body,
          })
        : recaptchaFetchJson(`${RECAPTCHA_AUTH}/redeem-requests`, {
              method: "POST",
              body,
          });
}

export async function getActiveRedeemRequests(
    event_id?: number,
    redeem_type?: RedeemRequestType
): Promise<RedeemRequestCount[]> {
    const params = queryString.stringify({ event_id, redeem_type }, { sort: false });
    try {
        return authClient.isAuthenticated()
            ? secureFetch(`${API_BASE}/redeem-requests/active/count?${params}`)
            : fetchJson(`${API_BASE}/redeem-requests/active/count?${params}`);
    } catch (e) {
        return e;
    }
}

export async function updateRedeemRequests(id: number, accepted_codes: number): Promise<void> {
    try {
        return secureFetch(`${API_BASE}/redeem-requests/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                id,
                accepted_codes,
            }),
        });
    } catch (e) {
        return e;
    }
}

export type TemplateResponse = TemplatesResponse<Template>;

export async function getTemplates({ limit = 10, offset = 0, name = "" }: Params = {}): Promise<TemplateResponse> {
    return fetchJson(`${API_BASE}/event-templates?limit=${limit}&offset=${offset}&name=${name}`);
}

export async function getTemplateById(id?: number): Promise<Template> {
    const isAdmin = authClient.isAuthenticated();
    return isAdmin
        ? secureFetch(`${API_BASE}/event-templates-admin/${id}`)
        : fetchJson(`${API_BASE}/event-templates/${id}`);
}

export async function getEventByFancyId(fancyId: string, retry?: boolean): Promise<null | PoapFullEvent> {
    let isAdmin = authClient.isAuthenticated();
    if (retry) {
        isAdmin = false;
    }
    return isAdmin ? secureFetch(`${API_BASE}/events-admin/${fancyId}`) : fetchJson(`${API_BASE}/events/${fancyId}`);
}

export async function getEventById(id: number, retry?: boolean): Promise<PoapFullEvent | null> {
    let isAdmin = authClient.isAuthenticated();
    if (retry) {
        isAdmin = false;
    }
    return isAdmin ? secureFetch(`${API_BASE}/events/id/${id}`) : fetchJson(`${API_BASE}/events/id/${id}`);
}

export async function getSetting(settingName: string): Promise<null | PoapSetting> {
    return fetchJson(`${API_BASE}/settings/${settingName}`);
}

export async function getTokenInfoWithENS(tokenId: string): Promise<TokenInfo> {
    const token = await getTokenInfo(tokenId);

    try {
        const ens = await getENSFromAddress(token.owner);
        const ownerText = ens.valid ? `${ens.ens} (${token.owner})` : `${token.owner}`;
        const tokenParsed = { ...token, ens, ownerText };
        return tokenParsed;
    } catch (error) {
        return token;
    }
}

export function setSetting(settingName: string, settingValue: string): Promise<any> {
    return secureFetchNoResponse(`${API_BASE}/settings/${settingName}/${settingValue}`, {
        method: "PUT",
    });
}

export function burnToken(tokenId: string): Promise<QueueResponse> {
    return secureFetch(`${API_BASE}/burn/${tokenId}`, {
        method: "POST",
    });
}

export async function sendNotification(
    title: string,
    description: string,
    notificationType: string,
    selectedEventId: number | null
): Promise<any> {
    return secureFetchNoResponse(`${API_BASE}/notifications`, {
        method: "POST",
        body: JSON.stringify({
            title,
            description,
            event_id: selectedEventId ? selectedEventId : null,
            type: notificationType,
        }),
    });
}

export async function mintEventToManyUsers(
    eventId: number,
    addresses: string[],
    signer_address: string
): Promise<QueueResponse> {
    return secureFetch(`${API_BASE}/actions/mintEventToManyUsers`, {
        method: "POST",
        body: JSON.stringify({
            eventId,
            addresses,
            signer_address,
        }),
    });
}

export async function mintUserToManyEvents(
    eventIds: number[],
    address: string,
    signer_address: string
): Promise<QueueResponse> {
    return secureFetch(`${API_BASE}/actions/mintUserToManyEvents`, {
        method: "POST",
        body: JSON.stringify({
            eventIds,
            address,
            signer_address,
        }),
    });
}

export async function updateEvent(event: FormData, fancyId: string): Promise<void> {
    const isAdmin = authClient.isAuthenticated();
    const adapterFetchJson = isAdmin ? recaptchaSecureFetchJsonNoResponse : recaptchaFetchJsonNoResponse;
    return adapterFetchJson(`${RECAPTCHA_AUTH}/events/${fancyId}`, {
        method: "PUT",
        body: event,
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export async function createEvent(event: FormData) {
    const isAdmin = authClient.isAuthenticated();
    if (isAdmin) {
        return secureFetch(`${API_BASE}/events`, {
            method: "POST",
            body: event,
            headers: { "Content-Type": "multipart/form-data" },
        });
    }
    return fetchJson(`${API_BASE}/events`, {
        method: "POST",
        body: event,
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export async function createTemplate(event: FormData): Promise<Template> {
    const isAdmin = authClient.isAuthenticated();
    if (isAdmin) {
        return recaptchaSecureFetchJson(`${RECAPTCHA_AUTH}/event-templates`, {
            method: "POST",
            body: event,
            headers: { "Content-Type": "multipart/form-data" },
        });
    }
    return recaptchaFetchJson(`${RECAPTCHA_AUTH}/event-templates`, {
        method: "POST",
        body: event,
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export async function updateTemplate(event: FormData, id: number): Promise<void> {
    return fetchJsonNoResponse(`${API_BASE}/event-templates/${id}`, {
        method: "PUT",
        body: event,
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export async function getSigners(): Promise<AdminAddress[]> {
    return secureFetch(`${API_BASE}/signers`);
}

export function setSigner(id: number, gasPrice: string): Promise<any> {
    return secureFetchNoResponse(`${API_BASE}/signers/${id}`, {
        method: "PUT",
        body: JSON.stringify({ gas_price: gasPrice }),
    });
}

export function getNotifications(
    limit: number,
    offset: number,
    type?: string,
    recipientFilter?: string,
    eventId?: number
): Promise<PaginatedNotifications> {
    let paramsObject = { limit, offset };

    if (type) Object.assign(paramsObject, { type });

    if (recipientFilter === "everyone") {
        Object.assign(paramsObject, { event_id: "" });
    }

    if (recipientFilter === "event") {
        Object.assign(paramsObject, { event_id: eventId });
    }

    const params = queryString.stringify(paramsObject);

    return secureFetch(`${API_BASE}/notifications?${params}`);
}

export async function getQrCodes(
    limit: number,
    offset: number,
    passphrase: string,
    claimed?: boolean,
    scanned?: boolean,
    event_id?: number
): Promise<PaginatedQrCodes> {
    const isAdmin = authClient.isAuthenticated();
    const params = queryString.stringify({ limit, offset, claimed, event_id, scanned, passphrase }, { sort: false });
    return isAdmin ? secureFetch(`${API_BASE}/qr-code?${params}`) : fetchJson(`${API_BASE}/qr-code?${params}`);
}

export async function qrCodesRangeAssign(
    from: number,
    to: number,
    eventId: number | null,
    passphrase?: string
): Promise<void> {
    const isAdmin = authClient.isAuthenticated();

    return isAdmin
        ? secureFetchNoResponse(`${API_BASE}/qr-code/range-assign`, {
              method: "PUT",
              body: JSON.stringify({
                  numeric_id_min: from,
                  numeric_id_max: to,
                  event_id: eventId,
              }),
          })
        : fetchJsonNoResponse(`${API_BASE}/qr-code/range-assign`, {
              method: "PUT",
              body: JSON.stringify({
                  numeric_id_min: from,
                  numeric_id_max: to,
                  event_id: eventId,
                  passphrase,
              }),
          });
}

export async function qrCodesListAssign(
    qrHashes: string[],
    eventId: number | null
): Promise<QrCodesListAssignResponse> {
    return secureFetch(`${API_BASE}/qr-code/list-assign`, {
        method: "PUT",
        body: JSON.stringify({
            qr_code_hashes: qrHashes,
            event_id: eventId,
        }),
    });
}

export async function qrCreateMassive(
    qrHashes: string[],
    qrIds: string[],
    delegated_mint: boolean,
    event?: string
): Promise<void> {
    let unstringifiedBody = {
        qr_list: qrHashes,
        numeric_list: qrIds,
        delegated_mint,
    };

    if (Number(event) !== 0) Object.assign(unstringifiedBody, { event_id: Number(event) });

    const body = JSON.stringify(unstringifiedBody);

    return secureFetchNoResponse(`${API_BASE}/qr-code/list-create`, {
        method: "POST",
        body,
    });
}

export async function qrCodesSelectionUpdate(
    qrCodesIds: string[],
    eventId: number | null,
    passphrase?: string
): Promise<void> {
    const isAdmin = authClient.isAuthenticated();

    return isAdmin
        ? secureFetchNoResponse(`${API_BASE}/qr-code/update`, {
              method: "PUT",
              body: JSON.stringify({
                  qr_code_ids: qrCodesIds,
                  event_id: eventId,
              }),
          })
        : fetchJsonNoResponse(`${API_BASE}/qr-code/update`, {
              method: "PUT",
              body: JSON.stringify({
                  qr_code_ids: qrCodesIds,
                  event_id: eventId,
                  passphrase,
              }),
          });
}

export async function generateRandomCodes(event_id: number, amount: number, delegated_mint: boolean): Promise<void> {
    return secureFetchNoResponse(`${API_BASE}/qr-code/generate`, {
        method: "POST",
        body: JSON.stringify({
            event_id,
            amount,
            delegated_mint,
        }),
    });
}

export function getTransactions(params: {
    limit?: number;
    offset?: number;
    status?: string;
    signer?: string;
    qr_hash?: string;
}): Promise<PaginatedTransactions> {
    const params_string = queryString.stringify({ ...params }, { sort: false });
    const url = `${API_BASE}/transactions?${params_string}`;
    const adapterFetch = params.qr_hash ? fetchJson : secureFetch;
    return adapterFetch(url);
}

export function bumpTransaction(tx_hash: string, gasPrice: string): Promise<any> {
    return secureFetchNoResponse(`${API_BASE}/actions/bump`, {
        method: "POST",
        body: JSON.stringify({ txHash: tx_hash, gasPrice: gasPrice }),
    });
}

export function getAdminLogs(
    limit: number,
    offset: number,
    email: string,
    action: string,
    created_from: string,
    created_to: string,
    response_status?: number,
    event_id?: number
): Promise<PaginatedAdminLogs> {
    const params = queryString.stringify(
        { limit, offset, email, action, response_status, created_from, created_to, event_id },
        { sort: false }
    );
    return secureFetch(`${API_BASE}/admin-logs?${params}`);
}

export function getAdminActions(): Promise<AdminLogAction[]> {
    return secureFetch(`${API_BASE}/admin-logs/actions`);
}

export async function getClaimHash(hash: string): Promise<HashClaim> {
    return recaptchaFetchJson(`${RECAPTCHA_AUTH}/actions/claim-qr?qr_hash=${hash}`);
}

export async function postClaimHash(qr_hash: string, address: string, secret: string): Promise<HashClaim> {
    return recaptchaFetchJson(`${RECAPTCHA_AUTH}/actions/claim-qr`, {
        method: "POST",
        body: JSON.stringify({ qr_hash, address, secret }),
    });
}

export async function postTokenMigration(tokenId: number): Promise<MigrateResponse> {
    return fetchJson(`${API_BASE}/actions/migrate`, {
        method: "POST",
        body: JSON.stringify({ tokenId }),
    });
}

export function getEmailClaim(token: string): Promise<EmailClaim> {
    return fetchJson(`${API_BASE}/actions/claim-email?token=${token}`);
}

export function requestEmailRedeem(email: string): Promise<void> {
    return recaptchaFetchJson(`${RECAPTCHA_AUTH}/actions/claim-email`, {
        method: "POST",
        body: JSON.stringify({ email }),
    });
}

export async function redeemWithEmail(address: string, token: string, email: string): Promise<QueueResponse> {
    return fetchJson(`${API_BASE}/actions/redeem-email-tokens`, {
        method: "POST",
        body: JSON.stringify({ email, address, token }),
    });
}

/* Checkout */
export type Checkout = {
    id: number;
    fancy_id: string;
    start_time: string;
    end_time: string;
    max_limit: number;
    timezone: string;
    is_active: string;
    event: PoapEvent;
};

export interface PaginatedCheckouts {
    limit: number;
    offset: number;
    total: number;
    checkouts: Checkout[];
}

export interface PaginatedEvent {
    limit: number;
    offset: number;
    total: number;
    items: PoapEvent[];
}

export interface EventFilter {
    from_admin?: boolean;
    from_date?: Date;
    to_date?: Date;
    name?: string;
    expired?: boolean;
    private_event?: boolean;
}

type CheckoutRedeemResponse = {
    qr_hash: string;
};

export function getCheckout(fancyId: string): Promise<Checkout> {
    const isAdmin = authClient.isAuthenticated();
    return isAdmin ? secureFetch(`${API_BASE}/checkouts/${fancyId}`) : fetchJson(`${API_BASE}/checkouts/${fancyId}`);
}

export function redeemCheckout(fancyId: string, gRecaptchaResponse: string): Promise<CheckoutRedeemResponse> {
    return fetchJson(`${API_BASE}/checkouts/${fancyId}/redeem`, {
        method: "POST",
        body: JSON.stringify({ gRecaptchaResponse }),
    });
}

export function getCheckouts(
    limit: number,
    offset: number,
    eventId: number | undefined,
    activeStatus: boolean | null
): Promise<PaginatedCheckouts> {
    let paramsObject: any = { limit, offset };

    if (eventId) paramsObject["event_id"] = eventId;

    if (activeStatus !== null) {
        paramsObject["is_active"] = activeStatus;
    }

    const params = queryString.stringify(paramsObject);
    return secureFetch(`${API_BASE}/admin/checkouts/?${params}`);
}

export function createCheckout(
    event_id: number,
    fancy_id: string,
    start_time: string,
    end_time: string,
    max_limit: number,
    timezone: number
): Promise<Checkout> {
    return secureFetch(`${API_BASE}/checkouts`, {
        method: "POST",
        body: JSON.stringify({
            event_id,
            fancy_id,
            start_time,
            end_time,
            max_limit,
            timezone,
        }),
    });
}

export function editCheckout(
    event_id: number,
    fancy_id: string,
    start_time: string,
    end_time: string,
    max_limit: number,
    timezone: number,
    is_active: string
): Promise<Checkout> {
    return secureFetch(`${API_BASE}/checkouts/${fancy_id}`, {
        method: "PUT",
        body: JSON.stringify({
            event_id,
            fancy_id,
            start_time,
            end_time,
            max_limit,
            timezone,
            is_active,
        }),
    });
}

export function getQueueMessage(messageId: string): Promise<Queue> {
    return fetchJson(`${API_BASE}/queue-message/${messageId}`);
}

/* Deliveries */
export interface Delivery {
    id: number;
    slug: string;
    card_title: string;
    card_text: string;
    page_title: string;
    page_title_image: string;
    page_text: string;
    image: string;
    active: boolean;
    metadata_title: string;
    metadata_description: string;
    event_ids: string;
    approved?: boolean | null;
    reviewed_by?: string;
    reviewed_date?: Date;
    events?: PoapFullEvent[];
    total_addresses?: number;
    private?: boolean;
}

export interface ExtendedDelivery extends Delivery {
    mail: string;
    addresses_amount: number;
}

export type DeliveryAddress = {
    address: string;
    claimed: boolean;
    event_ids: string;
};

export interface PaginatedDeliveries {
    limit: number;
    offset: number;
    total: number;
    deliveries: Delivery[];
}

export interface PaginatedDeliveryAddresses {
    limit: number;
    offset: number;
    total: number;
    items: DeliveryAddress[];
}

export function getDeliveries(
    limit: number,
    offset: number,
    eventId: number | undefined,
    approved?: boolean | null,
    active?: boolean | null,
    reviewed?: boolean | null
): Promise<PaginatedDeliveries> {
    let paramsObject: any = { limit, offset };

    if (eventId) paramsObject["event_id"] = eventId;

    if (authClient.isAuthenticated()) {
        // Only admins are allowed to modify these params
        if (approved !== null) {
            paramsObject["approved"] = approved;
        }
        if (reviewed !== null) {
            paramsObject["reviewed"] = reviewed;
        }
    }
    if (active !== null) {
        paramsObject["active"] = active;
    }

    const params = queryString.stringify(paramsObject);
    try {
        return authClient.isAuthenticated()
            ? secureFetch(`${API_BASE}/admin/deliveries?${params}`)
            : fetchJson(`${API_BASE}/deliveries?${params}`);
    } catch (e) {
        return e;
    }
}

export function getDelivery(id: string | number): Promise<Delivery> {
    return fetchJson(`${API_BASE}/delivery/${id}`);
}

export function getDeliveryAddresses(
    id: string | number,
    limit: number,
    offset: number
): Promise<PaginatedDeliveryAddresses> {
    const params = queryString.stringify({ limit, offset });
    return fetchJson(`${API_BASE}/delivery-addresses/${id}?${params}`);
}

export function createDelivery(
    slug: string,
    event_ids: string,
    card_title: string,
    card_text: string,
    page_title: string,
    page_text: string,
    metadata_title: string,
    metadata_description: string,
    image: string,
    page_title_image: string,
    secret_codes: string,
    addresses: any[]
): Promise<Delivery> {
    const url = `${RECAPTCHA_AUTH}/deliveries`;
    const payload = {
        method: "POST",
        body: JSON.stringify({
            slug,
            event_ids,
            card_title,
            card_text,
            page_title,
            page_text,
            metadata_title,
            metadata_description,
            image,
            page_title_image,
            secret_codes,
            addresses,
        }),
    };
    return authClient.isAuthenticated() ? recaptchaSecureFetchJson(url, payload) : recaptchaFetchJson(url, payload);
}

export function updateDelivery(
    id: number,
    slug: string,
    card_title: string,
    card_text: string,
    page_title: string,
    page_text: string,
    metadata_title: string,
    metadata_description: string,
    image: string,
    page_title_image: string,
    event_ids: string,
    secret_codes: string,
    active: boolean
): Promise<Delivery> {
    const url = `${API_BASE}/deliveries/${id}`;
    const payload = {
        method: "PUT",
        body: JSON.stringify({
            slug,
            card_title,
            card_text,
            page_title,
            page_text,
            metadata_title,
            metadata_description,
            image,
            page_title_image,
            event_ids,
            secret_codes,
            active,
        }),
    };
    return authClient.isAuthenticated() ? secureFetch(url, payload) : fetchJson(url, payload);
}

export function addDeliveryAddresses(
    id: number,
    event_ids: string,
    secret_codes: string,
    addresses: any[]
): Promise<Delivery> {
    const url = `${RECAPTCHA_AUTH}/deliveries/${id}/address/add`;
    const payload = {
        method: "POST",
        body: JSON.stringify({
            event_ids,
            secret_codes,
            addresses,
        }),
    };
    return authClient.isAuthenticated() ? recaptchaSecureFetchJson(url, payload) : recaptchaFetchJson(url, payload);
}

export function updateDeliveryStatus(id: number, approved: boolean): Promise<void> {
    return secureFetch(`${API_BASE}/admin/deliveries/review/${id}`, {
        method: "PUT",
        body: JSON.stringify({
            approved,
        }),
    });
}

export function rebuildDeliveries(): Promise<Delivery> {
    return secureFetch(`${API_BASE}/admin/deliveries/build`, {
        method: "PUT",
        body: JSON.stringify({}),
    });
}

/* Secrets */
export type Secret = {
    claim_name: string;
    active: boolean;
    captcha: boolean;
    created: string;
    from: string;
    to: string;
    timezone: number;
    event_id: number;
    //api core secrets supply
    total?: number;
    claimed?: number;
};

export interface PaginatedSecrets {
    limit: number;
    offset: number;
    total: number;
    items: Secret[];
}

export type WebsiteClaimUrl = {
    claimName: string;
    claimUrl: string;
    ip: string;
    claimed: boolean;
    claimedTime: Date;
    time: Date;
};

export async function claimSecret(address: string, website: string): Promise<Response> {
    return await recaptchaFetchGenericRequest(`${RECAPTCHA_AUTH}/website/claim`, {
        method: "POST",
        body: JSON.stringify({ address, website }),
    });
}

export function getSecrets(
    limit: number,
    offset: number,
    active: boolean | null,
    timeframe: string | null,
    type: EventSecretType
): Promise<PaginatedSecrets> {
    let paramsObject: any = { limit, offset };

    if (active !== null) {
        paramsObject["active"] = active;
    }

    if (timeframe !== null) {
        paramsObject["timeframe"] = timeframe;
    }

    if (type !== undefined) {
        paramsObject["secret_type"] = type;
    }

    const params = queryString.stringify(paramsObject);
    return secureFetch(`${API_BASE}/secrets?${params}`);
}

export function getSecretByEventIdAndSecretCode(
    eventId: number,
    secret_type: EventSecretType,
    secret_code?: string
): Promise<Secret> {
    const body = JSON.stringify(secret_code ? { secret_code } : {});
    const payload: RequestInit = {
        method: "POST",
        body,
    };
    const url = `${API_BASE}/secret/event/id/${eventId}?secret_type=${secret_type}`;

    return authClient.isAuthenticated() ? secureFetch(url, payload) : fetchJson(url, payload);
}

export function getSecretByName(claimName: string): Promise<Secret> {
    return secureFetch(`${API_BASE}/admin/secrets/${claimName}`);
}

export async function getSecretWebsiteByName(claimName: string): Promise<Response> {
    return await recaptchaFetchGenericRequest(`${RECAPTCHA_AUTH}/secret/${claimName}`);
}

export function getWebsiteClaimUrls(claimName: string, claimed?: boolean): Promise<WebsiteClaimUrl[]> {
    if (claimed === true) {
        return secureFetch(`${API_WEBSITES}/admin/delivery/claimed/${claimName}`);
    }

    return secureFetch(`${API_WEBSITES}/admin/delivery/${claimName}`);
}

export async function createSecret(
    event_id: number,
    claim_name: string,
    requested_codes: number,
    secret_type: EventSecretType,
    from?: string,
    to?: string,
    captcha?: boolean,
    active?: boolean,
    secret_code?: string
): Promise<Secret> {
    const body = JSON.stringify({
        event_id,
        secret_code,
        claim_name,
        requested_codes,
        from,
        to,
        secret_type,
        captcha,
        active,
        timezone: 0,
    });

    const payload: RequestInit = {
        method: "POST",
        body,
    };

    const url: string = `${RECAPTCHA_AUTH}/secret-requests`; //TODO: test endpoint

    return authClient.isAuthenticated()
        ? await recaptchaSecureFetchJson(url, payload)
        : await recaptchaFetchJson(url, payload);
}

export async function updateSecret(
    event_id: number,
    claim_name: string,
    from: string,
    to: string,
    secret_type: EventSecretType,
    captcha?: boolean,
    active?: boolean,
    secret_code?: string
): Promise<Secret> {
    const body = JSON.stringify({
        event_id,
        claim_name,
        from,
        to,
        secret_type,
        captcha,
        active,
        secret_code,
        timezone: 0,
        qr_requests_requested_codes_check: false,
    });

    const payload: RequestInit = {
        method: "PUT",
        body,
    };

    const url = `${RECAPTCHA_AUTH}/secret-requests`;

    return authClient.isAuthenticated()
        ? await recaptchaSecureFetchJson(url, payload)
        : await recaptchaFetchJson(url, payload);
}

export async function deleteClaimUrl(claimUrl: string): Promise<Secret> {
    return secureFetch(`${API_WEBSITES}/admin/delivery/`, {
        method: "DELETE",
        body: JSON.stringify({
            claimUrl: claimUrl,
        }),
    });
}

interface TheGraphResponse<T> {
    data: T;
}

interface TheGraphDataTokensQuantity {
    event?: TheGraphEventTokensQuantity;
}

interface TheGraphEventTokensQuantity {
    id: string;
    tokenCount: string;
}

export async function tokensQuantityByEventId(eventId: number): Promise<number> {
    let promises: Array<Promise<number>> = [];

    if (L2_THE_GRAPH_URL) {
        promises = promises.concat(tokensQuantityByEventIdAndSubgraphUrl(eventId, L2_THE_GRAPH_URL));
    }

    if (ETH_THE_GRAPH_URL) {
        promises = promises.concat(tokensQuantityByEventIdAndSubgraphUrl(eventId, ETH_THE_GRAPH_URL));
    }

    const results = await Promise.all(promises);

    return results.reduce((acc, value) => acc + value, 0);
}

async function tokensQuantityByEventIdAndSubgraphUrl(eventId: number, subgraphUrl: string): Promise<number> {
    const query = `{"query":"{event(id: ${eventId}){id tokenCount}}"}`;
    const request = { body: query, method: "POST" };
    const count = (await fetchJson<TheGraphResponse<TheGraphDataTokensQuantity>>(subgraphUrl, request)).data.event
        ?.tokenCount;
    return count ? parseInt(count) : 0;
}

interface ValidateEventAndSecretCodeResponse {
    valid: boolean;
}

export async function validateEventAndSecretCode(event_id: number, secret_code: string): Promise<boolean> {
    try {
        const ret = await recaptchaFetchJson<ValidateEventAndSecretCodeResponse>(`${RECAPTCHA_AUTH}/event/validate`, {
            method: "POST",
            body: JSON.stringify({
                event_id,
                secret_code,
            }),
        });

        return ret && ret.valid;
    } catch (e) {
        return false;
    }
}

export async function getPaginatedEvents(
    filter: EventFilter,
    offset?: number,
    limit?: number,
    sort?: SortCondition
): Promise<PaginatedEvent> {
    const params = queryString.stringify({
        ...filter,
        from_date: filter.from_date ? filter.from_date.toISOString() : undefined,
        to_date: filter.to_date ? filter.to_date.toISOString() : undefined,
        private_event: filter.private_event,
        offset,
        limit,
        sort_dir: sort?.sort_direction,
        sort_field: sort?.sort_by,
    });
    const url = `${API_BASE}/paginated-events?${params}`;
    const fetcher = authClient.isAuthenticated() ? secureFetch : fetchJson;
    return fetcher(url);
}

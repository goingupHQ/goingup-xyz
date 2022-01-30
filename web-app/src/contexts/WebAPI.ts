const host = process.env.NEXT_PUBLIC_GOINGUP_API_HOST;
console.log(host);
export interface WebAPI {
    getSignerAddress: (message: string, signature: string) => Promise<string>;
}

const api: WebAPI = {
    getSignerAddress: async (message: string, signature: string) => {
        const response = await fetch(`${host}/get-signer-address?message=${message}&signature=${signature}`);
        const payload = await response.json();
        return payload.recoveredAddress;
    }
}

export default api;
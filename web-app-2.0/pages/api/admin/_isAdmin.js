import admins from './admins.json';

export default async function isAdmin(address) {
    return admins.includes(address);
}
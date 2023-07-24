import { getDb } from '../database';
import { Organization, OrganizationGroup } from '../../types/organization';

export const getAll = async () => {
  const db = await getDb();
  return await db.collection<Organization>('orgs').find().toArray();
};

export const get = async (code: string) => {
  const db = await getDb();
  return await db.collection<Organization>('orgs').findOne({ code });
};

export const isOwner = async (code: string, address: string) => {
  const db = await getDb();
  const org = await get(code);
  return Boolean(org?.owners?.includes(address));
};

export const createOrgCodes = async () => {
  const orgs = await getAll();
  for (const org of orgs) {
    const code = org.name.replace(' ', '-').replace(/-+/g, '-').toLowerCase();
    const db = await getDb();
    await db.collection('orgs').updateOne({ _id: org._id }, { $set: { code } });
  }
};

export const addRewardToken = async (code: string, tokenId: number) => {
  const db = await getDb();
  const col = db.collection<Organization>('orgs');
  await col.updateOne({ code }, { $push: { rewardTokens: tokenId } });
};

export const saveGroup = async (code: string, orgCode:string, name: string, description: string) => {
  const db = await getDb();
  const col = db.collection<OrganizationGroup>('org-groups');
  await col.updateOne(
    { code },
    {
      $set: {
        code,
        orgCode,
        name,
        description,
      },
    },
    { upsert: true }
  );
};

export const getGroups = async (orgCode: string) => {
  const db = await getDb();
  const col = db.collection<OrganizationGroup>('org-groups');
  return await col.find({ orgCode }).toArray();
};
import { makeId } from './id';
import db from './db';
import Token from '../models/token';

export async function createTokenEntry(storeName)  {
	const tokenEntry = new Token();
	const id = makeId();
	tokenEntry.storeName = storeName;
	tokenEntry.id = id;
	tokenEntry.save(err => {
		if (err) {
			console.error(err);
		}
	})
	return { status: 'success' };
}

async function findTokenEntryByStoreName(storeName) {
	const tokenEntry = await Token.findOne({
		storeName
	});
	return tokenEntry;
}

export async function findTokenEntryByClientToken(clientToken) {
	const tokenEntry = await Token.findOne({
		clientToken
	});
	return tokenEntry;
}

// returns client token
export async function addTokenToTokenEntry(storeName, accessToken) {
	const tokenEntry = await findTokenEntryByStoreName(storeName);
	const clientToken = makeId();
	tokenEntry.clientToken = clientToken;
	tokenEntry.storeToken = accessToken;
	tokenEntry.save(err => {
		if (err) {
			console.error(err);
		}
	})
	return { clientToken };
}
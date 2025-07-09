import pRetry from "p-retry";
import { createClient } from "redis";
import { envPrivate } from "@/privateEnv";

export const getRedis = async () => {
	return pRetry(
		async () => {
			const client = createClient({
				url: envPrivate.REDIS_URL,
			});

			await client.connect();
			return client;
		},
		{
			retries: 3,
			minTimeout: 1000,
			maxTimeout: 5000,
		},
	);
};

export const subscribe = async function* <T = unknown>(
	channel: string,
): AsyncGenerator<T> {
	const redis = await getRedis();

	const messageQueue: T[] = [];
	let resolveNext: ((value: T) => void) | null = null;

	await redis.subscribe(channel, (message) => {
		const parsedMessage = JSON.parse(message);
		if (resolveNext) {
			resolveNext(parsedMessage);
			resolveNext = null;
		} else {
			messageQueue.push(parsedMessage);
		}
	});

	while (true) {
		if (messageQueue.length > 0) {
			const message = messageQueue.shift();
			if (message !== undefined) {
				yield message;
			}
		} else {
			const message = await new Promise<T>((resolve) => {
				resolveNext = resolve;
			});
			yield message;
		}
	}
};
